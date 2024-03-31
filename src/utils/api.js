const fetchProducts = async () => {
    try {
      const response = await fetch('https://t3t4-dfe-pb-grl-m1-default-rtdb.firebaseio.com/products.json');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data = await response.json();
      const productsArray = Object.values(data);
      return productsArray;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };
  
  export { fetchProducts };
  