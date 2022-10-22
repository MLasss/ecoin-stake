import { useEffect, useState } from "react";
import Pagination from 'react-bootstrap/Pagination';
import Item from "./Item";

function ItemList( {tokens, totalCount, accountConnected, loaded} ) {
  const [ pagedTokens, setPagedTokens] = useState([]);
  const [ paginationItem, setPaginationItems ] = useState(null);

  useEffect(() => {
    setPagedTokens(tokens.slice(0, process.env.REACT_APP_PER_PAGE_COUNT));
    updatePagination(1)
  }, [tokens])

  function fetchPage(e){
    const latestPage = e.target.innerText ? parseInt(e.target.innerText): 1;
    setPagedTokens(tokens.slice((process.env.REACT_APP_PER_PAGE_COUNT*(latestPage-1)),process.env.REACT_APP_PER_PAGE_COUNT*latestPage ))
    updatePagination(latestPage)
  }

  function updatePagination(latestPage){
    let pagesCount = Math.ceil(totalCount/ process.env.REACT_APP_PER_PAGE_COUNT)
    let items = [];
    for (let number = 1; number <= pagesCount; number++) {
      items.push(
        <Pagination.Item key={number} active={number === latestPage} onClick={fetchPage}>
          {number}
        </Pagination.Item>,
      );
    }

    setPaginationItems(items);
  }

  return (
    <>
      <div className="row">
        {tokens.length > 0 ? 
          pagedTokens.map((token, index) => (
            <div className="col-md-3" key={index}>
                <Item token={token}/>
            </div>
          )) : (
            <></>
        )}
        {tokens.length > process.env.REACT_APP_PER_PAGE_COUNT ? (
          <Pagination className="justify-content-center">{paginationItem}</Pagination>
          ) : (
            <></>
        )}
        {accountConnected === null ? (
          <div>
            Emojicoin requires <a href="https://metamask.io/" title="Metamask" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" fill="none" viewBox="0 0 172 33">
                <path fill="#161616" d="M151.26 16.64c-.89-.58-1.86-1-2.78-1.52-.6-.33-1.24-.63-1.76-1.06-.88-.72-.7-2.15.22-2.77 1.33-.88 3.52-.39 3.76 1.41 0 .04.04.07.08.07h2c.05 0 .09-.04.07-.1a3.94 3.94 0 00-1.46-2.94 4.66 4.66 0 00-2.84-.97c-5.28 0-5.77 5.59-2.92 7.35.33.2 3.12 1.6 4.1 2.21 1 .61 1.3 1.73.88 2.6-.4.81-1.4 1.37-2.42 1.3-1.1-.06-1.96-.66-2.26-1.59-.05-.17-.08-.5-.08-.63a.09.09 0 00-.08-.08h-2.17c-.03 0-.07.04-.07.08 0 1.56.39 2.43 1.45 3.22 1 .75 2.1 1.07 3.22 1.07 2.97 0 4.5-1.68 4.8-3.41.28-1.7-.22-3.23-1.74-4.24zm-94.2-7.59h-2.02a.09.09 0 00-.07.05l-1.78 5.86a.08.08 0 01-.16 0L51.25 9.1c-.01-.04-.04-.05-.08-.05h-3.31c-.04 0-.08.04-.08.07v14.96c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V12.7c0-.09.13-.1.15-.02l1.8 5.9.13.4c0 .05.03.06.07.06h1.67c.04 0 .06-.03.07-.05l.13-.42 1.8-5.9c.02-.08.15-.06.15.03v11.37c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V9.12c0-.03-.04-.07-.08-.07h-1.27zm60.98 0a.09.09 0 00-.08.05l-1.78 5.86a.08.08 0 01-.16 0l-1.78-5.86c0-.04-.03-.05-.07-.05h-3.3c-.04 0-.08.04-.08.07v14.96c0 .04.04.08.08.08h2.17c.03 0 .07-.04.07-.08V12.7c0-.09.13-.1.16-.02l1.8 5.9.12.4c.02.05.04.06.08.06h1.66a.1.1 0 00.08-.05l.13-.42 1.8-5.9c.02-.08.15-.06.15.03v11.37c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V9.12c0-.03-.04-.07-.08-.07h-3.3zm-27.99 0H79.8c-.03 0-.07.04-.07.07V11c0 .04.04.08.07.08h3.97v13c0 .05.04.09.07.09h2.17c.04 0 .08-.04.08-.08V11.07h3.96c.04 0 .08-.04.08-.08V9.12c0-.03-.02-.07-.08-.07zm12.8 15.11h1.98c.05 0 .09-.06.07-.1l-4.08-15.01c0-.04-.03-.06-.07-.06H97.9a.09.09 0 00-.07.06l-4.08 15c-.02.05.02.1.07.1h1.98c.04 0 .06-.02.08-.05l1.18-4.36c.01-.04.04-.05.08-.05h4.36c.04 0 .07.02.08.05l1.18 4.36c.02.03.06.06.08.06zm-5.18-6.61l1.58-5.85a.08.08 0 01.16 0l1.58 5.85c.02.05-.02.1-.07.1h-3.17c-.06 0-.1-.05-.08-.1zm38.85 6.61h1.98c.05 0 .09-.06.08-.1L134.5 9.04c-.02-.04-.04-.06-.08-.06h-2.83a.09.09 0 00-.08.06l-4.08 15c-.01.05.03.1.08.1h1.97c.04 0 .07-.02.08-.05l1.18-4.36c.02-.04.04-.05.08-.05h4.37c.03 0 .06.02.07.05l1.19 4.36c0 .03.04.06.07.06zm-5.18-6.61l1.59-5.85a.08.08 0 01.15 0l1.59 5.85c0 .05-.03.1-.08.1h-3.17c-.05 0-.1-.05-.08-.1zm-64.12 4.39V17.3c0-.04.03-.08.07-.08h5.78c.04 0 .08-.04.08-.07v-1.87a.09.09 0 00-.08-.08H67.3c-.04 0-.07-.04-.07-.08v-3.96c0-.04.03-.08.07-.08h6.58c.04 0 .08-.04.08-.08V9.14a.09.09 0 00-.08-.08h-8.9a.09.09 0 00-.08.08v14.94c0 .04.04.08.08.08h9.17c.04 0 .08-.04.08-.08V22.1a.09.09 0 00-.08-.08h-6.86c-.04-.01-.06-.04-.06-.09zm103.86 2.09l-7.5-7.74a.08.08 0 010-.1l6.75-7a.07.07 0 00-.06-.13h-2.76c-.03 0-.04.01-.05.03l-5.73 5.93a.08.08 0 01-.13-.05V9.14a.09.09 0 00-.08-.08h-2.17a.09.09 0 00-.08.08v14.95c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08v-6.58c0-.07.09-.1.13-.05l6.5 6.68a.1.1 0 00.04.03h2.77c.05-.01.1-.1.04-.14z"></path>
                <path fill="#E17726" stroke="#E17726" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M32.96 1l-13.14 9.72 2.45-5.73L32.96 1z"></path>
                <path fill="#E27625" stroke="#E27625" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M2.66 1l13.02 9.8L13.35 5 2.66 1zm25.57 22.53l-3.5 5.34 7.49 2.06 2.14-7.28-6.13-.12zm-26.96.12l2.13 7.28 7.47-2.06-3.48-5.34-6.12.12z"></path>
                <path fill="#E27625" stroke="#E27625" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M10.47 14.51l-2.08 3.14 7.4.34-.24-7.97-5.08 4.5zm14.68.01l-5.16-4.6-.17 8.07 7.4-.34-2.07-3.13zM10.87 28.87l4.49-2.16-3.86-3-.63 5.16zm9.4-2.17l4.46 2.17-.6-5.17-3.86 3z"></path>
                <path fill="#D5BFB2" stroke="#D5BFB2" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M24.73 28.87l-4.46-2.16.36 2.9-.04 1.23 4.14-1.97zm-13.86 0l4.16 1.97-.03-1.23.36-2.9-4.49 2.16z"></path>
                <path fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M15.1 21.78l-3.7-1.08 2.62-1.2 1.09 2.28zm5.41 0l1.1-2.29 2.63 1.2-3.73 1.1z"></path>
                <path fill="#CC6228" stroke="#CC6228" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M10.87 28.87l.65-5.34-4.13.12 3.48 5.22zm13.23-5.34l.63 5.34 3.5-5.22-4.13-.12zm3.13-5.88l-7.4.34.68 3.8 1.1-2.3 2.63 1.2 2.99-3.04zM11.4 20.7l2.62-1.2 1.09 2.28.69-3.8-7.4-.33 3 3.05z"></path>
                <path fill="#E27525" stroke="#E27525" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M8.4 17.65l3.1 6.05-.1-3-3-3.05zm15.84 3.05l-.12 3 3.1-6.05-2.98 3.05zm-8.44-2.71l-.7 3.8.88 4.48.2-5.91-.38-2.37zm4.02 0l-.36 2.36.18 5.92.87-4.49-.69-3.8z"></path>
                <path fill="#F5841F" stroke="#F5841F" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M20.51 21.78l-.87 4.49.63.44 3.85-3 .12-3.01-3.73 1.08zM11.4 20.7l.1 3 3.86 3 .62-.43-.87-4.49-3.72-1.08z"></path>
                <path fill="#C0AC9D" stroke="#C0AC9D" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M20.6 30.84l.03-1.23-.34-.28h-4.96l-.33.28.03 1.23-4.16-1.97 1.46 1.2 2.95 2.03h5.05l2.96-2.04 1.44-1.19-4.14 1.97z"></path>
                <path fill="#161616" stroke="#161616" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M20.27 26.7l-.63-.43h-3.66l-.62.44-.36 2.9.33-.28h4.96l.34.28-.36-2.9z"></path>
                <path fill="#763E1A" stroke="#763E1A" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M33.52 11.35L34.62 6l-1.66-5-12.7 9.4 4.89 4.11 6.9 2.01 1.52-1.77-.66-.48 1.05-.96-.8-.62 1.05-.8-.7-.54zM1 5.99l1.12 5.36-.72.53 1.07.8-.8.63 1.04.96-.66.48 1.52 1.77 6.9-2 4.89-4.13L2.66 1 1 5.99z"></path>
                <path fill="#F5841F" stroke="#F5841F" stroke-linecap="round" stroke-linejoin="round" stroke-width=".25" d="M32.05 16.52l-6.9-2 2.08 3.13-3.1 6.05 4.1-.05h6.13l-2.31-7.13zm-21.58-2.01l-6.9 2.01-2.3 7.13H7.4l4.1.05-3.1-6.05 2.08-3.14zm9.35 3.48l.45-7.6 2-5.4h-8.92l2 5.4.45 7.6.17 2.38v5.9h3.67l.02-5.9.16-2.38z"></path>
              </svg>
            </a> wallet to interact with <a href="https://polygon.technology/" title="Polygon" target="_blank">
              <svg width="90" viewBox="0 0 153 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.9585 9.7759C26.2994 9.36998 25.4425 9.36998 24.7175 9.7759L19.5762 12.8879L16.0828 14.9175L10.9416 18.0296C10.2825 18.4355 9.4256 18.4355 8.70055 18.0296L4.61393 15.5941C3.9548 15.1882 3.4934 14.444 3.4934 13.6321V8.82875C3.4934 8.01691 3.88888 7.27273 4.61393 6.86681L8.63464 4.49894C9.29377 4.09302 10.1506 4.09302 10.8757 4.49894L14.8964 6.86681C15.5555 7.27273 16.0169 8.01691 16.0169 8.82875V11.9408L19.5103 9.84355V6.7315C19.5103 5.91966 19.1149 5.17548 18.3898 4.76956L10.9416 0.30444C10.2825 -0.10148 9.4256 -0.10148 8.70055 0.30444L1.12053 4.76956C0.39548 5.17548 0 5.91966 0 6.7315V15.7294C0 16.5412 0.39548 17.2854 1.12053 17.6913L8.70055 22.1564C9.35969 22.5624 10.2166 22.5624 10.9416 22.1564L16.0828 19.112L19.5762 17.0148L24.7175 13.9704C25.3766 13.5645 26.2335 13.5645 26.9585 13.9704L30.9792 16.3383C31.6384 16.7442 32.0998 17.4884 32.0998 18.3002V23.1036C32.0998 23.9154 31.7043 24.6596 30.9792 25.0655L26.9585 27.5011C26.2994 27.907 25.4425 27.907 24.7175 27.5011L20.6968 25.1332C20.0376 24.7273 19.5762 23.9831 19.5762 23.1712V20.0592L16.0828 22.1564V25.2685C16.0828 26.0803 16.4783 26.8245 17.2034 27.2304L24.7834 31.6956C25.4425 32.1015 26.2994 32.1015 27.0244 31.6956L34.6045 27.2304C35.2636 26.8245 35.725 26.0803 35.725 25.2685V16.2706C35.725 15.4588 35.3295 14.7146 34.6045 14.3087L26.9585 9.7759Z" fill="#7950DD"/>
                <path d="M49.6421 29.1225V21.6525C50.4459 22.6725 51.9046 23.2425 53.6016 23.2425C57.9183 23.2425 60.8359 20.1525 60.8359 15.4425C60.8359 10.7325 58.1565 7.6425 53.9588 7.6425C52.0237 7.6425 50.5352 8.3625 49.6421 9.5325V7.8825H45.5039V29.1225H49.6421ZM53.0955 19.6425C50.8627 19.6425 49.4039 17.9625 49.4039 15.4425C49.4039 12.8925 50.8627 11.2125 53.0955 11.2125C55.2687 11.2125 56.7573 12.8925 56.7573 15.4425C56.7573 17.9625 55.2687 19.6425 53.0955 19.6425Z" fill="black"/>
                <path d="M70.2325 23.2425C74.847 23.2425 78.1516 19.9425 78.1516 15.4425C78.1516 10.9425 74.847 7.6425 70.2325 7.6425C65.6181 7.6425 62.3135 10.9425 62.3135 15.4425C62.3135 19.9425 65.6181 23.2425 70.2325 23.2425ZM70.2325 19.6425C67.9997 19.6425 66.4814 17.9325 66.4814 15.4425C66.4814 12.9225 67.9997 11.2125 70.2325 11.2125C72.4654 11.2125 73.9837 12.9225 73.9837 15.4425C73.9837 17.9325 72.4654 19.6425 70.2325 19.6425Z" fill="black"/>
                <path d="M84.7914 23.0025V1.3125H80.6533V23.0025H84.7914Z" fill="black"/>
                <path d="M97.2307 7.8825L94.1048 17.6325L90.9491 7.8825H86.7216L92.1697 22.8825L89.9667 29.1225H93.9262L96.0399 22.9425L101.488 7.8825H97.2307Z" fill="black"/>
                <path d="M113.11 9.3825C112.276 8.3325 110.788 7.6425 108.972 7.6425C104.595 7.6425 101.946 10.7325 101.946 15.4425C101.946 20.1525 104.595 23.2425 109.031 23.2425C110.788 23.2425 112.365 22.5825 113.14 21.4725V23.4525C113.14 24.8625 112.217 25.8525 110.966 25.8525H104.059V29.1225H111.621C115.015 29.1225 117.278 27.0525 117.278 23.9025V7.8825H113.11V9.3825ZM109.686 19.6425C107.483 19.6425 106.024 17.9925 106.024 15.4425C106.024 12.8925 107.483 11.2125 109.686 11.2125C111.919 11.2125 113.378 12.8925 113.378 15.4425C113.378 17.9925 111.919 19.6425 109.686 19.6425Z" fill="black"/>
                <path d="M127.71 23.2425C132.325 23.2425 135.629 19.9425 135.629 15.4425C135.629 10.9425 132.325 7.6425 127.71 7.6425C123.096 7.6425 119.791 10.9425 119.791 15.4425C119.791 19.9425 123.096 23.2425 127.71 23.2425ZM127.71 19.6425C125.477 19.6425 123.959 17.9325 123.959 15.4425C123.959 12.9225 125.477 11.2125 127.71 11.2125C129.943 11.2125 131.461 12.9225 131.461 15.4425C131.461 17.9325 129.943 19.6425 127.71 19.6425Z" fill="black"/>
                <path d="M142.061 23.0025V14.7225C142.061 12.7725 143.341 11.3625 145.157 11.3625C146.883 11.3625 148.044 12.6825 148.044 14.5125V23.0025H152.212V13.5825C152.212 10.1025 150.009 7.6425 146.615 7.6425C144.561 7.6425 142.894 8.5125 142.061 9.9825V7.8825H137.893V23.0025H142.061Z" fill="black"/>
              </svg>
            </a> blockchain. For installation guide please follow to the official <a href="https://metamask.io/download/" title="Metamask download" target="_blank">Metamask</a> site.
            <br/>
          </div>
          ) : (
            <></>
        )}
        {accountConnected != null && tokens.length === 0 && !loaded? (
          <div>Loading...</div>
          ) : (
            <></>
        )}
        {accountConnected != null && tokens.length === 0 && loaded? (
          <div>You have no items in your gallery.</div>
          ) : (
            <></>
        )} 
            
      </div>
    </>
  );
}

export default ItemList;