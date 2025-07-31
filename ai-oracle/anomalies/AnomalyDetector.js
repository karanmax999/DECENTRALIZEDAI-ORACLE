/**
 * AnomalyDetector - Detects anomalies in oracle data submissions
 * This helps prevent manipulation and ensure data quality
 */
class AnomalyDetector {
  /**
   * Constructor for the anomaly detector
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = {
      // Standard deviation multiplier for statistical outlier detection
      stdDevThreshold: 3,
      
      // Threshold for sudden change detection (percentage)
      suddenChangeThreshold: 20,
      
      // Minimum number of data points required for analysis
      minDataPoints: 5,
      
      // Maximum age of data points to consider (in milliseconds)
      maxDataAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      
      // Custom thresholds for specific data types
      customThresholds: {
        ASSET_PRICES: {
          BTC: 15, // 15% change threshold for BTC
          ETH: 20, // 20% change threshold for ETH
          CORE: 25 // 25% change threshold for CORE
        }
      },
      
      ...config
    };
    
    this.detectedAnomalies = [];
  }
  
  /**
   * Detect anomalies in a new data submission
   * @param {Object} submission - The new data submission
   * @param {Array} historicalData - Array of historical data points
   * @returns {Object} - Anomaly detection results
   */
  detectAnomalies(submission, historicalData = []) {
    try {
      console.log(`AnomalyDetector: Analyzing submission ID ${submission.id}`);
      
      // Parse submission data
      const data = typeof submission.dataValue === 'string' 
        ? JSON.parse(submission.dataValue) 
        : submission.dataValue;
      
      // Filter relevant historical data
      const relevantHistory = this._filterRelevantHistory(data, historicalData);
      
      // If we don't have enough historical data, we can't detect anomalies
      if (relevantHistory.length < this.config.minDataPoints) {
        return {
          hasAnomalies: false,
          anomalies: [],
          message: `Insufficient historical data (${relevantHistory.length}/${this.config.minDataPoints} points required)`,
          submissionId: submission.id
        };
      }
      
      // Detect anomalies based on data type
      const anomalies = this._detectAnomaliesByType(data, relevantHistory);
      
      // Store detection results
      const result = {
        hasAnomalies: anomalies.length > 0,
        anomalies,
        timestamp: Date.now(),
        submissionId: submission.id
      };
      
      if (result.hasAnomalies) {
        this.detectedAnomalies.push(result);
      }
      
      return result;
    } catch (error) {
      console.error("Error in anomaly detection:", error);
      return {
        hasAnomalies: false,
        anomalies: [],
        error: error.message,
        submissionId: submission.id
      };
    }
  }
  
  /**
   * Filter historical data to only include relevant entries
   * @param {Object} data - Current data submission
   * @param {Array} historicalData - All historical data
   * @returns {Array} - Filtered relevant historical data
   */
  _filterRelevantHistory(data, historicalData) {
    const currentTime = Date.now();
    const dataType = data.type;
    
    return historicalData
      // Only include data of the same type
      .filter(item => {
        const itemData = typeof item.data === 'string' 
          ? JSON.parse(item.data) 
          : item.data;
        return itemData && itemData.type === dataType;
      })
      // Only include data within the maximum age
      .filter(item => {
        const itemTimestamp = item.timestamp || (item.data && item.data.timestamp);
        return itemTimestamp && (currentTime - itemTimestamp <= this.config.maxDataAge);
      })
      // Sort by timestamp (newest first)
      .sort((a, b) => {
        const aTimestamp = a.timestamp || (a.data && a.data.timestamp);
        const bTimestamp = b.timestamp || (b.data && b.data.timestamp);
        return bTimestamp - aTimestamp;
      });
  }
  
  /**
   * Detect anomalies based on data type
   * @param {Object} data - Current data submission
   * @param {Array} history - Relevant historical data
   * @returns {Array} - Detected anomalies
   */
  _detectAnomaliesByType(data, history) {
    switch (data.type) {
      case 'ASSET_PRICES':
        return this._detectAssetPriceAnomalies(data, history);
      case 'MARKET_METRICS':
        return this._detectMarketMetricAnomalies(data, history);
      default:
        return []; // No anomaly detection for unknown data types
    }
  }
  
  /**
   * Detect anomalies in asset price data
   * @param {Object} data - Current asset price data
   * @param {Array} history - Historical asset price data
   * @returns {Array} - Detected anomalies
   */
  _detectAssetPriceAnomalies(data, history) {
    const anomalies = [];
    
    // Get most recent historical data point
    const mostRecent = history[0];
    const mostRecentData = typeof mostRecent.data === 'string' 
      ? JSON.parse(mostRecent.data) 
      : mostRecent.data;
    
    // Check each asset for anomalies
    for (const [asset, info] of Object.entries(data.predictions)) {
      // Skip if asset doesn't exist in historical data
      if (!mostRecentData.predictions[asset]) continue;
      
      const currentPrice = info.price;
      const previousPrice = mostRecentData.predictions[asset].price;
      
      // Calculate percentage change
      const percentChange = Math.abs((currentPrice - previousPrice) / previousPrice * 100);
      
      // Get threshold for this asset (custom or default)
      const threshold = this.config.customThresholds.ASSET_PRICES?.[asset] || 
        this.config.suddenChangeThreshold;
      
      // Check if change exceeds threshold
      if (percentChange > threshold) {
        anomalies.push({
          type: 'SUDDEN_PRICE_CHANGE',
          asset,
          currentPrice,
          previousPrice,
          percentChange,
          threshold,
          severity: this._calculateSeverity(percentChange, threshold)
        });
      }
      
      // Check for statistical outliers if we have enough history
      if (history.length >= 5) {
        const priceHistory = history.map(item => {
          const itemData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
          return itemData.predictions[asset]?.price;
        }).filter(price => price !== undefined);
        
        const stats = this._calculateStats(priceHistory);
        const zScore = Math.abs((currentPrice - stats.mean) / stats.stdDev);
        
        if (zScore > this.config.stdDevThreshold) {
          anomalies.push({
            type: 'STATISTICAL_OUTLIER',
            asset,
            currentPrice,
            mean: stats.mean,
            stdDev: stats.stdDev,
            zScore,
            threshold: this.config.stdDevThreshold,
            severity: this._calculateSeverity(zScore, this.config.stdDevThreshold)
          });
        }
      }
    }
    
    return anomalies;
  }
  
  /**
   * Detect anomalies in market metric data
   * @param {Object} data - Current market metric data
   * @param {Array} history - Historical market metric data
   * @returns {Array} - Detected anomalies
   */
  _detectMarketMetricAnomalies(data, history) {
    const anomalies = [];
    
    // Get most recent historical data point
    const mostRecent = history[0];
    const mostRecentData = typeof mostRecent.data === 'string' 
      ? JSON.parse(mostRecent.data) 
      : mostRecent.data;
    
    // Check for inconsistent market dominance
    const totalDominance = data.metrics.btcDominance + data.metrics.ethDominance;
    if (totalDominance > 100) {
      anomalies.push({
        type: 'INCONSISTENT_DATA',
        metric: 'marketDominance',
        value: totalDominance,
        message: `Total dominance exceeds 100%: ${totalDominance.toFixed(2)}%`,
        severity: 'HIGH'
      });
    }
    
    // Check for sudden changes in market cap
    const currentMarketCap = data.metrics.totalMarketCap;
    const previousMarketCap = mostRecentData.metrics.totalMarketCap;
    const marketCapChange = Math.abs((currentMarketCap - previousMarketCap) / previousMarketCap * 100);
    
    if (marketCapChange > this.config.suddenChangeThreshold) {
      anomalies.push({
        type: 'SUDDEN_MARKET_CAP_CHANGE',
        currentValue: currentMarketCap,
        previousValue: previousMarketCap,
        percentChange: marketCapChange,
        threshold: this.config.suddenChangeThreshold,
        severity: this._calculateSeverity(marketCapChange, this.config.suddenChangeThreshold)
      });
    }
    
    return anomalies;
  }
  
  /**
   * Calculate basic statistics for an array of values
   * @param {Array} values - Array of numerical values
   * @returns {Object} - Mean and standard deviation
   */
  _calculateStats(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, stdDev };
  }
  
  /**
   * Calculate severity level based on how much a value exceeds a threshold
   * @param {Number} value - The value to check
   * @param {Number} threshold - The threshold for comparison
   * @returns {String} - Severity level (LOW, MEDIUM, HIGH)
   */
  _calculateSeverity(value, threshold) {
    const ratio = value / threshold;
    
    if (ratio >= 2) return 'HIGH';
    if (ratio >= 1.5) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Get all detected anomalies
   * @returns {Array} - Array of detected anomalies
   */
  getDetectedAnomalies() {
    return [...this.detectedAnomalies];
  }
  
  /**
   * Clear anomaly history
   */
  clearAnomalies() {
    this.detectedAnomalies = [];
  }
}

module.exports = AnomalyDetector; 