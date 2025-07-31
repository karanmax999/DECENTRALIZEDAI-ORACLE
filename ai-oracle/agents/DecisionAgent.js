/**
 * DecisionAgent - LLM-based reasoning agent for oracle data validation
 * This agent uses reasoning to validate data submissions and detect anomalies
 */
class DecisionAgent {
  /**
   * Constructor for the decision agent
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = {
      confidenceThreshold: 0.75, // Minimum confidence to accept a decision
      reasoningSteps: 3, // Number of reasoning steps
      maxRetries: 2, // Maximum number of retries for ambiguous decisions
      ...config
    };
    
    this.decisions = [];
    this.reasoningCache = new Map();
  }
  
  /**
   * Analyze a data submission and make a decision
   * @param {Object} submission - The data submission to analyze
   * @param {Array} historicalData - Historical data for context
   * @returns {Promise<Object>} - Decision with reasoning
   */
  async analyzeSubmission(submission, historicalData = []) {
    try {
      console.log(`DecisionAgent: Analyzing submission ID ${submission.id}`);
      
      // Parse submission data
      const data = typeof submission.dataValue === 'string' 
        ? JSON.parse(submission.dataValue) 
        : submission.dataValue;
      
      // Generate reasoning chain
      const reasoning = await this._generateReasoning(data, historicalData);
      
      // Make decision based on reasoning
      const decision = await this._makeDecision(reasoning, submission);
      
      // Store decision for future reference
      this.decisions.push({
        submissionId: submission.id,
        timestamp: Date.now(),
        decision: decision.result,
        confidence: decision.confidence,
        reasoning: reasoning
      });
      
      return decision;
    } catch (error) {
      console.error("Error in DecisionAgent:", error);
      return {
        result: "ERROR",
        confidence: 0,
        reasoning: ["Error occurred during analysis"],
        error: error.message
      };
    }
  }
  
  /**
   * Generate a chain of reasoning about the data
   * @param {Object} data - The data to reason about
   * @param {Array} historicalData - Historical data for context
   * @returns {Promise<Array>} - Array of reasoning steps
   */
  async _generateReasoning(data, historicalData) {
    // In a real implementation, this would call an LLM API
    // For this demo, we'll simulate reasoning with predefined logic
    
    const reasoningSteps = [];
    
    // Step 1: Check data structure and required fields
    reasoningSteps.push(this._checkDataStructure(data));
    
    // Step 2: Check for anomalies by comparing with historical data
    if (historicalData.length > 0) {
      reasoningSteps.push(this._checkForAnomalies(data, historicalData));
    } else {
      reasoningSteps.push("No historical data available for comparison. Cannot detect anomalies.");
    }
    
    // Step 3: Check internal consistency of the data
    reasoningSteps.push(this._checkInternalConsistency(data));
    
    return reasoningSteps;
  }
  
  /**
   * Make a decision based on reasoning
   * @param {Array} reasoning - Array of reasoning steps
   * @param {Object} submission - The original submission
   * @returns {Promise<Object>} - Decision with confidence
   */
  async _makeDecision(reasoning, submission) {
    // Count negative reasoning steps
    const negativeSteps = reasoning.filter(step => 
      typeof step === 'string' && (
        step.includes("anomaly") || 
        step.includes("inconsistent") || 
        step.includes("invalid") ||
        step.includes("error")
      )
    ).length;
    
    // Calculate confidence based on reasoning
    const confidence = Math.max(0, 1 - (negativeSteps / reasoning.length));
    
    // Make decision
    let result;
    if (confidence >= this.config.confidenceThreshold) {
      result = "VALID";
    } else if (confidence <= 0.3) {
      result = "INVALID";
    } else {
      result = "UNCERTAIN";
    }
    
    return {
      result,
      confidence,
      reasoning,
      submissionId: submission.id
    };
  }
  
  /**
   * Check data structure and required fields
   * @param {Object} data - The data to check
   * @returns {String} - Reasoning about data structure
   */
  _checkDataStructure(data) {
    if (!data) {
      return "Invalid: Data is null or undefined";
    }
    
    if (!data.type) {
      return "Invalid: Missing data type";
    }
    
    if (!data.timestamp) {
      return "Invalid: Missing timestamp";
    }
    
    // Check specific data types
    if (data.type === 'ASSET_PRICES') {
      if (!data.predictions || Object.keys(data.predictions).length === 0) {
        return "Invalid: Asset price data missing predictions";
      }
      return "Valid: Data structure contains all required fields for asset prices";
    }
    
    if (data.type === 'MARKET_METRICS') {
      if (!data.metrics) {
        return "Invalid: Market metrics data missing metrics object";
      }
      return "Valid: Data structure contains all required fields for market metrics";
    }
    
    return `Uncertain: Unknown data type '${data.type}'`;
  }
  
  /**
   * Check for anomalies by comparing with historical data
   * @param {Object} data - The data to check
   * @param {Array} historicalData - Historical data for comparison
   * @returns {String} - Reasoning about anomalies
   */
  _checkForAnomalies(data, historicalData) {
    if (data.type === 'ASSET_PRICES') {
      // Get most recent historical data
      const recentData = historicalData
        .filter(item => item.data && item.data.type === 'ASSET_PRICES')
        .sort((a, b) => b.data.timestamp - a.data.timestamp)[0];
      
      if (!recentData) {
        return "No comparable historical asset price data found";
      }
      
      // Check for large price changes
      const anomalies = [];
      for (const [asset, info] of Object.entries(data.predictions)) {
        if (recentData.data.predictions[asset]) {
          const previousPrice = recentData.data.predictions[asset].price;
          const currentPrice = info.price;
          const percentChange = Math.abs((currentPrice - previousPrice) / previousPrice * 100);
          
          // Flag if change is over 20%
          if (percentChange > 20) {
            anomalies.push(`${asset} price changed by ${percentChange.toFixed(2)}%`);
          }
        }
      }
      
      if (anomalies.length > 0) {
        return `Potential anomalies detected: ${anomalies.join(', ')}`;
      }
      
      return "No significant anomalies detected in asset prices";
    }
    
    return "Anomaly detection not implemented for this data type";
  }
  
  /**
   * Check internal consistency of the data
   * @param {Object} data - The data to check
   * @returns {String} - Reasoning about internal consistency
   */
  _checkInternalConsistency(data) {
    if (data.type === 'ASSET_PRICES') {
      // Check if all prices are positive
      const negativeAssets = Object.entries(data.predictions)
        .filter(([_, info]) => info.price <= 0)
        .map(([asset]) => asset);
      
      if (negativeAssets.length > 0) {
        return `Invalid: Negative or zero prices for assets: ${negativeAssets.join(', ')}`;
      }
      
      return "Valid: All asset prices are positive and consistent";
    }
    
    if (data.type === 'MARKET_METRICS') {
      // Check if market cap and dominance are consistent
      const metrics = data.metrics;
      if (metrics.btcDominance + metrics.ethDominance > 100) {
        return "Invalid: BTC and ETH dominance combined exceeds 100%";
      }
      
      return "Valid: Market metrics are internally consistent";
    }
    
    return "Consistency check not implemented for this data type";
  }
  
  /**
   * Get all past decisions
   * @returns {Array} - Array of past decisions
   */
  getDecisions() {
    return [...this.decisions];
  }
  
  /**
   * Clear decision history
   */
  clearDecisions() {
    this.decisions = [];
    this.reasoningCache.clear();
  }
}

module.exports = DecisionAgent; 