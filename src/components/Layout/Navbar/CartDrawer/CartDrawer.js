import { useState, useContext, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { Offcanvas, Button, Modal } from 'react-bootstrap'

import { CartContext } from '../../../../common/context/Cart.context'
import ShoppingCart from '../../../ShoppingCart/ShoppingCart'

import './CartDrawer.css'

const CartDrawer = () => {
  const { cart, count, setCount } = useContext(CartContext)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    if (cart && cart.products) setCount(cart.products.length)
  }, [cart])

  return (
    <>
      <div className="nav-link" onClick={handleShow}>
        <FontAwesomeIcon icon={faShoppingCart} className="me-3" />
        <span id="cart-count"> {count} </span>
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        id="popup-cart"
        placement={'end'}
        name={'end'}
      >
        <Modal.Header closeButton className="text-center">
          <Modal.Title >Shopping Cart</Modal.Title>
        </Modal.Header>
        <Offcanvas.Body>
          <ShoppingCart />
        </Offcanvas.Body>

        <Modal.Footer>
          <Button
            variant="success"
            href="/my-account/checkout"
            size="lg"
            className="w-100"
          >
            Checkout
          </Button>
        </Modal.Footer>
      </Offcanvas>
    </>
  )
}

export default CartDrawer

// <>
//   <div className="nav-link" onClick={handleShow}>
//     <FontAwesomeIcon icon={faShoppingCart} className="me-3" />
//     <span id="cart-count"> {count} </span>
//   </div>
//   <Modal id="popup-cart" show={show} onHide={handleClose}>
//     <Modal.Header closeButton>
//       <Modal.Title>Shopping Cart</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//       <ShoppingCart />
//     </Modal.Body>
//     <Modal.Footer>
//       <Button
//         variant="success"
//         href="/my-account/checkout"
//         size="lg"
//         className="w-100"
//       >
//         Checkout
//       </Button>
//     </Modal.Footer>
//   </Modal>
// </>