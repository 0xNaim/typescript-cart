import { Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import storeItems from '../data/items.json';
import { formatCurrency } from '../utilities/formatCurrency';
import CartItem from './CartItem';

type ShoppingCartProps = {
  isOpen: boolean;
};

const ShoppingCart = ({ isOpen }: ShoppingCartProps): JSX.Element => {
  const { closeCart, cartItems } = useShoppingCart();
  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          <Stack gap={3}>
            {cartItems.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}
            <hr />
            <div className='ms-auto fw-bold fs-5'>
              Total:
              {formatCurrency(
                cartItems.reduce((total, cartItem) => {
                  const item = storeItems.find(
                    (item) => item.id === cartItem.id
                  );
                  return total + (item?.price || 0) * cartItem.quantity;
                }, 0)
              )}
            </div>
          </Stack>
        ) : (
          <div>There are no carts</div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ShoppingCart;
