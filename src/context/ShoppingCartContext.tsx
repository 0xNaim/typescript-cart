import { createContext, ReactNode, useContext, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

type CartItem = {
  id: number;
  quantity: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => useContext(ShoppingCartContext);

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const getItemQuantity = (id: number) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  const increaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null)
        return [...currItems, { id, quantity: 1 }];

      return currItems.map((item) => {
        if (item.id === id) return { ...item, quantity: item.quantity + 1 };
        return item;
      });
    });
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1)
        return currItems.filter((item) => item.id !== id);

      return currItems.map((item) => {
        if (item.id === id) return { ...item, quantity: item.quantity - 1 };
        return item;
      });
    });
  };

  const removeFromCart = (id: number) =>
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));

  return (
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
};
