import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ===== مقداردهی اولیه از localStorage =====
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ===== ذخیره در localStorage با هر تغییر =====
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ===== افزودن آیتم =====
  const addItem = (newItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === newItem._id);
      if (existing) {
        return prev.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  // ===== حذف آیتم =====
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // ===== به‌روزرسانی تعداد =====
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // ===== خالی کردن سبد =====
  const clearCart = () => {
    setCart([]);
  };

  // ===== محاسبه تعداد کل =====
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ===== محاسبه قیمت کل =====
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
