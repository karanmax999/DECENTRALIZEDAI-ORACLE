const BaseModel = require('./BaseModel');

/**
 * AssetPriceModel - AI model for simulating asset price predictions
 * This model generates synthetic price data with historical patterns and volatility
 */
class AssetPriceModel extends BaseModel {
  /**
   * Constructor for the asset price model
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    super('AssetPriceModel', {
      assets: ['BTC', 'ETH', 'CORE', 'BNB', 'SOL'],
      volatility: {
        BTC: 0.03,
        ETH: 0.045,
        CORE: 0.05,
        BNB: 0.035,
        SOL: 0.06
      },
      basePrices: {
        BTC: 50000,
        ETH: 3000,
        CORE: 10,
        BNB: 400,
        SOL: 100
      },
      ...config
    });
    
    this.priceHistory = {};
    
    // Initialize price history for each asset
    this.config.assets.forEach(asset => {
      this.priceHistory[asset] = [this.config.basePrices[asset]];
    });
  }

  /**
   * Generate a prediction for asset prices
   * @param {Object} input - Input parameters (optional)
   * @returns {Promise<Object>} - Predicted prices with confidence
   */
  async predict(input = {}) {
    const { specificAsset } = input;
    const assets = specificAsset 
      ? [specificAsset] 
      : this.config.assets;
      
    const predictions = {};
    
    // Generate new price for each requested asset
    for (const asset of assets) {
      if (!this.priceHistory[asset]) {
        throw new Error(`Unknown asset: ${asset}`);
      }
      
      // Get last price
      const lastPrice = this.priceHistory[asset][this.priceHistory[asset].length - 1];
      
      // Generate new price with random walk + volatility
      const volatility = this.config.volatility[asset] || 0.04;
      const change = (Math.random() - 0.5) * 2 * volatility * lastPrice;
      const newPrice = Math.max(lastPrice + change, 0.01); // Ensure price is positive
      
      // Store in history
      this.priceHistory[asset].push(newPrice);
      if (this.priceHistory[asset].length > 1000) {
        this.priceHistory[asset].shift(); // Keep history limited
      }
      
      // Format for prediction
      predictions[asset] = {
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat((((newPrice / lastPrice) - 1) * 100).toFixed(2)),
        currency: 'USD'
      };
    }
    
    // Generate confidence score
    const confidence = this.getRandomConfidence();
    
    return this.formatOutput({
      type: 'ASSET_PRICES',
      timestamp: Date.now(),
      predictions
    }, confidence);
  }
  
  /**
   * Get the price history for an asset
   * @param {string} asset - The asset symbol
   * @returns {Array<number>} - Array of historical prices
   */
  getAssetHistory(asset) {
    if (!this.priceHistory[asset]) {
      throw new Error(`Unknown asset: ${asset}`);
    }
    return [...this.priceHistory[asset]];
  }
}

module.exports = AssetPriceModel; 