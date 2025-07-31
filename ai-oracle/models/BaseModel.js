/**
 * BaseModel - Abstract base class for all AI oracle models
 * This serves as the foundation for different AI model implementations
 */
class BaseModel {
  /**
   * Constructor for the base model
   * @param {string} modelName - Name of the model
   * @param {Object} config - Configuration options for the model
   */
  constructor(modelName, config = {}) {
    this.modelName = modelName;
    this.config = {
      confidence: {
        min: 50,
        max: 95
      },
      ...config
    };
    this.lastPrediction = null;
  }

  /**
   * Generate a prediction - This must be implemented by child classes
   * @param {Object} input - Input data for prediction
   * @returns {Promise<Object>} - The prediction result with confidence
   */
  async predict(input) {
    throw new Error('Method predict() must be implemented by subclasses');
  }

  /**
   * Get a random confidence score within the configured range
   * @returns {number} - A confidence score between min and max
   */
  getRandomConfidence() {
    const { min, max } = this.config.confidence;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Format the output of the model in a standardized way
   * @param {any} data - The data to format
   * @param {number} confidence - Confidence score (0-100)
   * @returns {Object} - Formatted output with metadata
   */
  formatOutput(data, confidence) {
    const output = {
      data,
      metadata: {
        modelName: this.modelName,
        timestamp: Date.now(),
        confidence,
        version: '1.0.0'
      }
    };
    
    this.lastPrediction = output;
    return output;
  }
  
  /**
   * Get the last prediction made by this model
   * @returns {Object|null} - The last prediction or null if none
   */
  getLastPrediction() {
    return this.lastPrediction;
  }
}

module.exports = BaseModel; 