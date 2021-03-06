import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { useContext } from 'react'
import { AuthContext } from '../../common/context/Auth.context'

import defaultImage from '../../images/img-default.jpg'

import './ProductCard.css'

const ProductCard = (props) => {
  const { user } = useContext(AuthContext)
  const { product, handleDelete, isShop } = props

  return (
    <>
      <Card id="card-products" className="col-sm-12 col-md-6 col-lg-3">
        <Link to={`/products/${product._id}`}>
          <div className="img-container">
            <Card.Img
              variant="top"
              src={product.imageUrl || defaultImage}
              className="w-100"
              alt={product.name}
            />
          </div>
          <Card.Body className="prod-text">
            <Card.Title className="text-center product-name">
              {product.name}
            </Card.Title>
            <Card.Text>
              <span className="text-center product-brand">{product.brand}</span>
            </Card.Text>
            <Card.Text>
              <span className="text-center price">{product.totalPrice} €</span>
            </Card.Text>
          </Card.Body>
        </Link>

        {user?.isAdmin && !isShop && (
          <>
            <Link
              to={`/my-account/admin/product/edit/${product._id}`} //TODO  pasar a App.js
              className="btn btn-outline-secondary edit-btn w-100"
            >
              Edit
            </Link>

            <Button
              variant="outline-danger"
              onClick={() => handleDelete(product._id, product.name)}
              className="delete-btn w-100"
            >
              Delete
            </Button>
          </>
        )}
      </Card>
    </>
  )
}

export default ProductCard
