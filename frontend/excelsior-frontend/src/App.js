import './App.css';
import MenuBar from './MenuBar.js'
import { useCallback, useEffect, useState } from 'react';
import contract from './contracts/Auction.json';
import { ethers } from 'ethers';

const contractAddress = "0xD82BAD54b1f9fF16952AC08DA535980A14609caE";
const contractABI = contract;
const ImageGallery = () => {
  return (
    <div style={{textAlign: 'center', marginLeft:'5em', marginRight:'5em'}}>
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/1.png" alt="image 1" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/2.png" alt="image 2" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/3.png" alt="image 3" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/4.png" alt="image 4" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/5.png" alt="image 5" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/6.png" alt="image 6" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />
      <img src="https://gateway.pinata.cloud/ipfs/QmZXmrrJihJnLo2axkxdvRARmW3nAkjTARLZveXnCG3mCF/7.png" alt="image 7" style={{ width: '225px', height: '225px', borderRadius:'8px', border: '2px solid black'}} />

    </div>
  );
};

function App(props) {
    var temp = 0;
    const [currentAccount, setCurrentAccount] = useState(null);
    const [owner, setOwner] = useState(null);
    const [auctionInfo, showAuctionInfo] = useState(false);
    const [highestBidder, setHighestBidder] = useState(null);
    const [highestBid, setHighestBid] = useState(null);
    const [auctionEnd, setAuctionEnd] = useState(null);
    const ids_to_temp = new Map();
    ids_to_temp.set(1, 9755);
    ids_to_temp.set(2, 9760);
    ids_to_temp.set(3, 9765);
    ids_to_temp.set(4, 9770);
    ids_to_temp.set(5, 9775);
    ids_to_temp.set(6, 9780);
    ids_to_temp.set(7, 9785);


    const checkWalletIsConnected = () => {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }
      else {
        console.log("Wallet Exists");
      }
    }
    const startingTime = new Date('December 19, 2022 19:38:00');
    setInterval(() => {
      const currentTime = new Date();
      const timeDifference = currentTime - startingTime;
      const secondsSinceStartingTime = timeDifference / 1000;

      const valueToIncreaseBy = 0.0000000011206949854696092 * secondsSinceStartingTime;
      const newValue = 14.9756486321 + valueToIncreaseBy;

      temp = parseFloat(newValue.toFixed(10))
    }, 1000);

    const connectWalletHandler = async () => { 
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log("Connected", account);
        setCurrentAccount(account);
        alert("Your wallet: ".concat(String(account)," is connected!"))
      }
      catch (error) {
        console.log(error);
      }
    }
      

    const enterAuctionHandler = async () => {
      try {
        const {ethereum} = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer)
          console.log("called");
          const bid = await contract.highestBid();
          const topBidder = await contract.highestBidder();
          const auctionEndTime = await contract.endAt();
          setHighestBid(ethers.utils.formatEther(bid));
          setHighestBidder(ethers.utils.getAddress(topBidder));
          setAuctionEnd(ethers.utils.formatUnits(auctionEndTime, 0));
          const seller = await contract.seller();
          if (ethers.utils.getAddress(seller) == ethers.utils.getAddress(currentAccount)) {
            console.log("You are the owner!")
            setOwner(true);
          }
          else {
            setOwner(false);
          }
          showAuctionInfo(true);
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    // Button to start the auction
    const startAuctionHandler = async () => {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        // Get the nft address, nft id, and starting price
        const nftAddress = ethers.utils.getAddress(document.querySelector("#nftAddress").value);
        const nftId = parseInt(document.querySelector("#nftId").value);
        const startingPrice = parseInt(document.querySelector("#startingPrice").value);
        const nft_temp = parseFloat("14.".concat(String(ids_to_temp.get(nftId))));
        if (nft_temp > temp) {
          alert("The current temperature is too low for this NFT to be auctioned off!");
          return;
        }
        try {
          const startTxn = await contract.start(nftAddress, nftId, startingPrice);
          await startTxn.wait();
          console.log("Auction Started!");
        } catch (error) {
          const err = error.error.message;
          if (err.includes("Already started!")) {
            alert("Already started!");
          } else if (err.includes("You did not start the auction!")) {
            alert("You did not start the auction!");
          } else {
            alert("Transaction failed");
          }
        }

        
      }
    }


    const endAuctionHandler = async () => {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        try {
          const endTxn = await contract.end();
          await endTxn.wait();
          console.log("Auction Ended!");
        } catch (error) {
          const err = error.error.message;
          if (err.includes("Auction is still ongoing")) {
            alert("Auction is still ongoing");
          } else if (err.includes("You need to start first!")) {
            alert("You need to start first!");
          } else if (err.includes("Auction already ended!")) {
            alert("Auction already ended!");
          } else {
            alert("Transaction failed");
          }
        }
      }
    }

    const bidHandler = async () => {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        const bidValue = document.querySelector("#bidValue").value;
        const bidValueWei = ethers.utils.parseEther(bidValue);
        try {
          const bidTxn = await contract.bid({value: bidValueWei});
          await bidTxn.wait();
          alert("Bid Complete!");
        } catch (error) {
          const err = error.error.message;
          if (err.includes("Not started")) {
            alert("Auction not started yet!");
          } else if (err.includes("Ended!")) {
            alert("Auction already ended!");
          } else {
            alert("Transaction failed, possibly due to insufficient bid");
          }
        }
        
      }
    }

    const withdrawHandler = async () => {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        try {
          const withdrawTxn = await contract.withdraw();
          await withdrawTxn.wait();
          alert("Withdraw Complete!");
        } catch (error) {
          const err = error.error.message;
          alert(err);
        }
      }
    }



    const connectWalletButton = () => {
      return (
        <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
          Connect Wallet
        </button>
      )
    }
    const enterAuctionButton = () => {
      return (
        <button onClick={enterAuctionHandler} className='cta-button auction-enter-button'>
          Enter Auction
        </button>
      )
    }

    // Button that allows user to start NFT auction and accepts nft address, nft id, and starting bid value
    const startAuctionButton = () => {
      return (
        <div>
          <input type="text" placeholder="Enter contract address" id="nftAddress" />
          <input type="text" placeholder="Enter NFT ID" id="nftId" />
          <input type="text" placeholder="Enter starting bid value" id="startingPrice" />
          <button onClick={startAuctionHandler} className='cta-button auction-start-button' style={{backgroundColor: "green"}}>
            Start Auction
          </button>
        </div>
      )
    }

    
    const endAuctionButton = () => {
      return (
        <button onClick={endAuctionHandler} className='cta-button auction-end-button' style={{backgroundColor: "red"}}>
          End Auction
        </button> 
      )
    }


    // Button that allows user to bid on an NFT by entering a value
    const bidButton = () => {
      const date = new Date(auctionEnd * 1000);
      return (
        <div>
          <input type="text" placeholder="Enter Bid Value" id="bidValue" />
          <button onClick={bidHandler} className='cta-button bid-button' style={{backgroundColor: "green"}}>
            Bid
          </button>
          <div>
            <h3>Auction Info</h3>
            <p>Highest Bid: {highestBid}</p>
            <p>Highest Bidder: {highestBidder}</p>
            <p>End Time: {date.toLocaleString()}</p>
          </div>
        </div>
      )
    }

    // Button that allows user to withdraw their bid
    const withdrawButton = () => {
      return (
        <button onClick={withdrawHandler} className='cta-button withdraw-button' style={{backgroundColor: "red"}}>
          Withdraw
        </button>
      )
    }


    useEffect(() => {
      checkWalletIsConnected();
    }, []);
  
    return (
      <div>
        <MenuBar />
          <div style={{ textAlign: 'center', marginTop: '5vh' }}>
            <h3>Welcome to Excelsior Climate!</h3>
          </div>
          <div style={{ textAlign: 'center', marginTop: '5vh', marginLeft: '40vh', marginRight: '40vh'}}>
            <h5>We aim to combat climate change through awareness and fundraising via NFTs that symbolize global warming through 1-of-1 special-edition-release NFTs everytime the temperature raises 0.0005 degrees Celsius. </h5>
          </div>
          <ImageGallery />

          <div style={{textAlign: 'center'}} dangerouslySetInnerHTML={{ __html: "<iframe title='World average temperature (°C)' src='https://www.theworldcounts.com/embeds/counters/21?background_color=white&color=black&font_family=%22Helvetica+Neue%22%2C+Arial%2C+sans-serif&font_size=20' style='border: none' height='100' width='300'></iframe>"}} />
          {!auctionInfo ?
            <div style={{ textAlign: 'center'}}>
              {currentAccount ? 
              <div style={{marginLeft: '25em', marginRight: '25em', marginTop:'3em', padding: '1em', border: '1px solid #ccc',borderRadius: '5px',backgroundColor: '#f2f2f2'}}>
                Your wallet <strong>{currentAccount}</strong> is connected.
                {enterAuctionButton()}
              </div>
              : connectWalletButton()}
            </div>
            :
            <div style={{ textAlign: 'center'}}>
              {owner ? <div style={{marginLeft: '25em', marginRight: '25em', marginTop:'3em', padding: '1em', border: '1px solid #ccc',borderRadius: '5px',backgroundColor: '#f2f2f2'}}>
                {startAuctionButton()}
                {endAuctionButton()}
              </div> : <div style={{marginLeft: '25em', marginRight: '25em', marginTop:'3em', padding: '1em', border: '1px solid #ccc',borderRadius: '5px',backgroundColor: '#f2f2f2'}}>
                {bidButton()}
                {withdrawButton()}
                </div>
              }
            </div>
          }
      </div>
    );
}

export default App;