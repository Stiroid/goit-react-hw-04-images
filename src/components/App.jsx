import React from "react";
import { useEffect, useState } from "react";
// import css from "../styles.module.css";

import Searchbar from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import Modal from "./Modal/Modal";
import * as API from "../services/pixabay_api";

import {AppWrapper} from "./App.styled"


export const App = () => {

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLargeImageURL, setCurrentLargeImageURL] = useState(false);
  const [error, setError] = useState(null);


  const onOpenLargeImg = (url) => {
    setCurrentLargeImageURL(url)
  }

  const toggleModal = () => {
    setCurrentLargeImageURL("")
  }

  const onSubmit = (query) =>{
    if (query.trim().length === 0) {
      alert("Please, enter your request")
      return
    }

    setQuery(query);
    setPage(1);
    setItems([]);
  }

  const onLoadMoreBtn = () => {
    setPage(prev => prev + 1)
  }

  const addPictures  = async (query, page) => {
    try {
      setIsLoading(true)
      const images = await API.loadImage(query, page);
      setItems(prevState => [...prevState, ...images])
      setIsLoading(false)
      
      if(images.length === 0) {
        alert("Wrong request. Please, enter another one");
      }
    } catch (error) {

      setError(error.message);

    } finally {
      setIsLoading(false) 
    }
  };

  useEffect(() => {
    if(query !== '') {
      addPictures(query, page)
    }
  }, [query, page])

    return(
      
      <AppWrapper>
        <Searchbar
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        
        {error && <p>{error}</p>}

        {items.length > 0 && <ImageGallery items={items} onClick={onOpenLargeImg}/>}

        {isLoading && <Loader/>}

        {items.length >= 12 && <Button onLoadMore={onLoadMoreBtn} isLoading={isLoading}/>}
        {currentLargeImageURL && <Modal onClose={toggleModal} url={currentLargeImageURL} />}

        {/* {this.state.isLoading && <Loader/>} */}

      </AppWrapper>
    )
  }



