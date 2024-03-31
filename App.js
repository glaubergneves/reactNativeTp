import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductsScreen from './src/screens/ProductsScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import { fetchProducts } from './src/utils/api';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => { 
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar os produtos:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Products"
            component={ProductsScreen}
            options={{ headerShown: false }}
            initialParams={{ products: products }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
