import './App.css';
import MenuBar from './MenuBar.js'
import { useEffect, useState } from 'react';
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

      temp = newValue.toFixed(10)
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
          if (currentAccount === contract.seller()) {
            console.log("You are the owner!")
            setOwner(true);
          }
          else {
            setOwner(false);
          }
        }
      }
      catch (error) {
        console.log(error);
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
    useEffect(() => {
      checkWalletIsConnected();
    }, [])
  
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
            <div style={{ textAlign: 'center'}}>
              {currentAccount ? 
              
              
              <div style={{marginLeft: '25em', marginRight: '25em', marginTop:'3em', padding: '1em', border: '1px solid #ccc',borderRadius: '5px',backgroundColor: '#f2f2f2'}}>
                Your wallet <strong>{currentAccount}</strong> is connected.
                {enterAuctionButton()}
              </div>
             
              
              
              
              
              : connectWalletButton()}
            </div>  

      </div>
    );
}

export default App;