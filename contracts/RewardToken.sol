// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token for rewarding users who participate in the oracle system
 */
contract RewardToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply cap
    uint256 public immutable MAX_SUPPLY;
    
    // Addresses authorized to mint tokens (oracle contract, staking contract)
    mapping(address => bool) public minters;
    
    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    /**
     * @dev Constructor to initialize the token
     * @param name Token name
     * @param symbol Token symbol
     * @param maxSupply Maximum supply cap
     * @param initialSupply Initial supply to mint to owner
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable() {
        require(initialSupply <= maxSupply, "Initial supply exceeds max supply");
        MAX_SUPPLY = maxSupply;
        
        // Mint initial supply to owner
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }
    
    /**
     * @dev Add an address to the list of authorized minters
     * @param minter Address to authorize for minting
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Minter cannot be zero address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove an address from the list of authorized minters
     * @param minter Address to remove from authorized minters
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Mint new tokens (only callable by authorized minters)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        _mint(to, amount);
    }
    
    /**
     * @dev Calculate rewards based on user participation
     * This is a placeholder function that would be called by the oracle contract
     * @param user Address of the user to calculate rewards for
     * @param participationScore Score based on user's participation (0-100)
     * @return Amount of tokens to reward
     */
    function calculateReward(address user, uint256 participationScore) external pure returns (uint256) {
        // Simple reward calculation: 10 tokens per 100 participation points
        // In a real implementation, this would be more complex
        return (participationScore * 10) / 100;
    }
} 