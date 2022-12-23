// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IERC721 {
    function transfer(address, uint) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract Auction {
    event Start();
    event End(address highestBidder, uint highestBid);
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);

    address payable public seller;

    bool public started;
    bool public ended;
    uint public endAt;

    IERC721 public nft;
    uint public nftId;

    uint public highestBid;
    address public highestBidder;
    mapping(address => uint) public bids;

    constructor () {
        seller = payable(msg.sender);
    }


    /// #if_succeeds {:msg "only owner can start auction"} msg.sender==seller; 
    /// #if_succeeds {:msg "auction has started"} started==true;
    /// #if_succeeds {:msg "highest bid is the startingbid"} highestBid == startingBid;
    function start(IERC721 _nft, uint _nftId, uint startingBid) external {
        require(!started, "Already started!");
        require(msg.sender == seller, "You are not the owner.");
        highestBid = startingBid;

        nft = _nft;
        nftId = _nftId;
        started = true;
        endAt = block.timestamp + 2 days;
        
        nft.transferFrom(msg.sender, address(this), nftId);
        emit Start();



    }

    /// #if_succeeds {:msg "bids is updated with old highest bidder"} old(highestBid) == bids[old(highestBidder)];
    function bid() external payable {
        require(started, "Not started.");
        require(block.timestamp < endAt, "Ended!");
        require(msg.value > highestBid);

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBid = msg.value;
        highestBidder = msg.sender;

        emit Bid(highestBidder, highestBid);
    }

    /// #if_succeeds {:msg "withdraw works"} bids[msg.sender]==0;
    function withdraw() external payable {

        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        (bool sent,) = payable(msg.sender).call{value: bal}("");
        require(sent, "Could not withdraw");
        emit Withdraw(msg.sender, bal);
    }

    /// #if_succeeds {:msg "auction ended"} ended == true;
    function end() external {

        require(started, "You need to start first!");
        require(block.timestamp >= endAt, "Auction is still ongoing!");
        require(!ended, "Auction already ended!");

        if (highestBidder != address(0)) {
            ended = true;
            nft.transfer(highestBidder, nftId);
            (bool sent,) = seller.call{value: highestBid}("");
            require(sent, "Could not pay seller!");
        } else {
            ended = true;
            nft.transfer(seller, nftId);
        }
        emit End(highestBidder, highestBid);
    }
}