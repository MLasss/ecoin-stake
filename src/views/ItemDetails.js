import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { isStaked, calculateStakeReward, stake, withdrawStake, emergencyWithdrawStake} from "../lib/staking";
import { getTokenURI, getOwnerOf } from "../lib/erc721";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TokenAttribute from "../components/TokenAttribute";
import LoadingImage from "../assets/images/loading.gif";
import alchemyClient from "../lib/alchemyClient";
import "../assets/css/ItemDetails.css";

function ItemDetails( { accountConnected } ) {
  const { id } = useParams();
  const [ showMessage, setShowMessage ] = useState(false);
  const [ headerMessage, setHeaderMessage ] = useState(null);  
  const [ showRefreshLink, setShowRefreshLink ] = useState(true);
  const [ metadata, setMetadata ] = useState(null);
  const [ owner, setOwner ] = useState(null);
  const [ owned, setOwned ] = useState(false);
  const [ staked, setStaked ] = useState(false);
  const [ reward, setReward ] = useState(null);
  const [ loaded, setLoaded ] = useState(false);
  const [ inputErrors, setInputErrors ] = useState("");
  const [ modalActionsDisabled, setModalActionsDisabled ] = useState(false);
  const [ stakeCoinModalVisibility, setStakeCoinModalVisibility] = useState(false);
  const [ unstakeCoinModalVisibility, setUnstakeCoinModalVisibility] = useState(false);
  const [ unlockCoinModalVisibility, setUnlockCoinModalVisibility] = useState(false);
  
  useEffect(() => {
    loadCoinMetadata();
    getOwnerOf(id).then(data => {
      setOwner(data);
      let isOwned = data != null && data === accountConnected;
      setOwned(isOwned);
      if (isOwned) {
        isStaked(id).then(st => {
          setStaked(st);
          if (st) calculateRewards();
        });
      }
    });

  }, [id, accountConnected]);
  
  function loadCoinMetadata() {
    getTokenURI(id).then(data => {
      let base64ToString = Buffer.from(data.substring(29), "base64").toString();
      let meta = JSON.parse(base64ToString);

      if (meta?.image){
        meta.image = meta.image.replace("ipfs://", process.env.REACT_APP_IPFS_GATEWAY);
      }
      setMetadata(meta);
      setLoaded(true);      
    });
  }

  function calculateRewards() {
    calculateStakeReward(id).then(rw => setReward(parseFloat((rw / 1000000000000000000).toFixed(3))));
  }

  // stake Modal ----------------------------

  function handleShowStakeItemModalBtn() {
      setInputErrors("");
      setStakeCoinModalVisibility(true);
      setModalActionsDisabled(false);
  }

  function stakeItem(){
    setInputErrors("");
    setModalActionsDisabled(true);
    stake(id).then(val => {
      if (val === "1"){
        setStakeCoinModalVisibility(false);
        displayMessageRefresh("The Coin has been successfully staked and is currently locked. It cannot be traded until it is unstaked. Remember to refresh the metadata on the Opensea gallery to see the changes on Opensea.");
        refreshScreenData();
      } else {
        setInputErrors(extractMessage(val?.message));
        setModalActionsDisabled(false);
      }
    });
  }

  // unstake Modal --------------------------

  function handleShowUnstakeItemModalBtn() {
    setInputErrors("");
    setUnstakeCoinModalVisibility(true);
    setModalActionsDisabled(false);
  }

  function unstakeItem(){
    setInputErrors("");
    setModalActionsDisabled(true);
    withdrawStake(id).then(val => {
      if (val === "1"){
        setUnstakeCoinModalVisibility(false);
        displayMessageRefresh("The Coin has been successfully unstaked and earned EMOJIS have been added to your account. Remember to refresh the metadata on the Opensea gallery to see the changes on Opensea.");
        refreshScreenData();
      } else {
        setInputErrors(extractMessage(val?.message));
        setModalActionsDisabled(false);
      }
    });
  }

  // unlock Modal --------------------------

  function handleShowUnlockItemModalBtn() {
    setInputErrors("");
    setUnlockCoinModalVisibility(true);
    setModalActionsDisabled(false);
  }

  function unlockItem(){
    setInputErrors("");
    setModalActionsDisabled(true);
    emergencyWithdrawStake(id).then(val => {
      if (val === "1"){
        setUnlockCoinModalVisibility(false);
        displayMessageRefresh("The Coin was successfully unlocked. Remember to refresh the metadata on the Opensea gallery to see the changes on Opensea.");
        refreshScreenData();
      } else {
        setInputErrors(extractMessage(val?.message));
        setModalActionsDisabled(false);
      }
    });
  }

  function refreshScreenData() {
    loadCoinMetadata();
    isStaked(id).then(st => { setStaked(st); });
    setReward(0);
  }

  function refreshMetadata() {
    alchemyClient.nft.getNftMetadata(process.env.REACT_APP_ERC721_TOKEN_ADDRESS, id).then(nft => {
      if (Math.floor((Date.now() - new Date(nft.timeLastUpdated))/60000) < 15 ) {
        displayMessage('Metadata can be refreshed every 15 min.')
      }
      alchemyClient.nft.refreshNftMetadata(process.env.REACT_APP_ERC721_TOKEN_ADDRESS, id);
    });
  }

  function displayMessage(message){
    setShowRefreshLink(false);
    setHeaderMessage(message);
    setShowMessage(true);  
  }
  
  function displayMessageRefresh(message){
    setShowRefreshLink(true);
    setHeaderMessage(message);
    setShowMessage(true);  
  }  

  function extractMessage(message) {
    if (message == null) return "Failed to execute transaction.";

    let startIndex = message.indexOf('execution reverted:');
    if (startIndex > 0)
    {
      let userMessage = message.substring(startIndex + 20);
      return userMessage.substring(0, userMessage.indexOf('"'))
    }

    if (message.length > 100) return "Failed to execute transaction.";

    return message;
  }

  return (
    <>
    { loaded ? (
      <div className="row my-3">
        <div className="col-md-12">
          <div className="card py-3  item-details-container">
            <div className="px-3">
                <Alert variant="secondary" show={showMessage} onClose={() => setShowMessage(false)} dismissible>
                  <p className="mb-0">
                      {headerMessage}
                      {
                        showRefreshLink ?
                        <><br/>You may need to wait few sec. and click <button type="button" className="btn btn-link pt-0 px-0" onClick={refreshScreenData}>Refresh Screen</button> to see updated data on the screen.</>
                          : <></>
                      }                      
                  </p>
                </Alert> 
              </div>            
              <div className="px-3">
                <Link className="btn btn-primary py-1" to="/">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 18 18">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                  </svg> 
                  My Stakeable Gallery
                </Link>
                <button type="button" className="btn btn-light action-btn py-1 align-right" onClick={refreshMetadata} disabled={!owned} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 18 18">
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>                            
                    Refresh Metadata
                </button>
              </div>
            <div className="card-body py-2">
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3 card item-card" style={{backgroundColor: "#"+metadata?.background_color}}>
                    <LazyLoadImage placeholderSrc={LoadingImage} src={metadata?.image} className="img-fluid" alt="" 
                      onError={({ currentTarget }) => {
                        displayMessage("It's taking longer to load image from IPFS, please be patient.");
                        currentTarget.src=LoadingImage;
                        setTimeout(function() { currentTarget.src=metadata?.image; }, 500);
                      }} 
                    />
                  </div>
                </div>
                <div className="col-md-8 px-1">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row px-2">
                        <div className="col-md-12"><h3>{ metadata?.name }</h3></div>
                      </div>
                      <div className="row px-2">
                        <div className="col-md-12"><p>{ metadata?.description}</p></div>
                      </div>
                      <div className="row px-2">
                          <p>  Owned by: <b>{owned ? 'You' : owner?.slice(-6).toUpperCase()}</b> </p>
                      </div>     
                      {
                        reward > 0 ?
                          (<div className="row px-2">
                          <p>  Staking Rewards: <b>{reward}</b> EMOJIS </p>
                          </div> )
                          : <></>
                      }
                      <div className="row px-3">
                        {metadata?.attributes.map((attribute, index) => (
                          <div className="col-md-4 mb-2 px-1" key={index}>
                            <TokenAttribute attribute={attribute} />
                          </div>
                        ))}
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="btn-group" role="group">
                            {
                            loaded && owned && !staked ? (
                              <button type="button" className="btn btn-secondary action-btn px-4 mx-2" onClick={handleShowStakeItemModalBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 19 19">
                                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                </svg>                                                          
                                Stake
                              </button>) 
                            : <></>
                            }
                            {
                            loaded && owned && staked ? (
                              <button type="button" className="btn btn-secondary action-btn px-4 mx-2" onClick={handleShowUnstakeItemModalBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-emoji-smile-fill" viewBox="0 0 19 19">
                                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
                                </svg>                          
                                Unstake
                              </button>) 
                            : <></>
                            }                                                           
                            {
                            loaded && owned && staked ? (
                              <button type="button" className="btn btn-danger action-btn px-4 mx-2" onClick={handleShowUnlockItemModalBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-unlock-fill" viewBox="0 0 19 19">
                                  <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/>
                                </svg>                              
                                Emergecy Unlock
                              </button>) 
                            : <></>
                            } 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={stakeCoinModalVisibility} onHide={() => setStakeCoinModalVisibility(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Stake The Coin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>Staking this coin will lock it and prevent it from being transferred or interacted with. However, you can choose to unstake the coin at any time. <br/><br/>
            Are you sure you want to proceed with the staking process?
            </span> 
            <br/>
            <span className="text-danger">{inputErrors}</span>
          </Modal.Body>
          <Modal.Footer className="text-center mx-auto input-modal-footer">
            <Button variant="danger" onClick={stakeItem} disabled={modalActionsDisabled} >
              Stake
            </Button>
            <Button variant="secondary" onClick={() => setStakeCoinModalVisibility(false)} disabled={modalActionsDisabled} >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={unstakeCoinModalVisibility} onHide={() => setUnstakeCoinModalVisibility(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Unstake The Coin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>Unstaking this coin will reward you with <b>{reward}</b> EMOJIS, <br/>but will also lower the coin's Grade. <br/><br/>  
            Are you sure you want to proceed?
            </span>
            <br/>
            <span className="text-danger">{inputErrors}</span>
          </Modal.Body>
          <Modal.Footer className="text-center mx-auto input-modal-footer">
            <Button variant="danger" onClick={unstakeItem} disabled={modalActionsDisabled} >
              Unstake
            </Button>
            <Button variant="secondary" onClick={() => setUnstakeCoinModalVisibility(false)} disabled={modalActionsDisabled} >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal> 

        <Modal show={unlockCoinModalVisibility} onHide={() => setUnlockCoinModalVisibility(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Unlock The Coin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>
              <b>Warning: </b> Proceeding with an emergency unlock will discard all accumulated stake rewards and unlock this coin. 
              However, the coin's grade will NOT be affected. <br/> <br/> 
              Are you sure you want to proceed?
            </span> 
            <br/>
            <span className="text-danger">{inputErrors}</span>
          </Modal.Body>
          <Modal.Footer className="text-center mx-auto input-modal-footer">
            <Button variant="danger" onClick={unlockItem} disabled={modalActionsDisabled} >
              Unlock
            </Button>
            <Button variant="secondary" onClick={() => setUnlockCoinModalVisibility(false)} disabled={modalActionsDisabled} >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>                 
        
      </div>
    ) : (<></>
    )}
      
    </>
  );
}

export default ItemDetails;