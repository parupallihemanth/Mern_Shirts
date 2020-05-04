import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadtoCart } from './helper/cartHelper'

const Cart = () => {
  
    const [products, setProducts] = useState([])

    useEffect(() =>{
      setProducts(loadtoCart())

    },[])

    
  

  const loadCart = () =>{
        return(
            <div>
                <h2>All products in cart</h2>
                {products.map((product, index) =>(
                  
                    <Card key={index}
                    product={product}
                    addtoCart = {false}
                    removeFromCart = {true}
                    />
                  
                ))}
            </div>
        )
  }

  const checkout = () =>{
      return(
          <div>
              <h2>checkout</h2>
          </div>
      )

  }

  return (
    <Base title="Cart page" description="Your cart">
      
        <div className="row">
          <div className="col-6">{loadCart()}</div>
          <div className="col-6">{checkout()}</div>
          
        </div>
      
    </Base>
  );
}


export default Cart