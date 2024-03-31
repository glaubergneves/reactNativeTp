import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import ProductCard from '../components/ProductCard';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://t3t4-dfe-pb-grl-m1-default-rtdb.firebaseio.com/products.json')
      .then(response => response.json())
      .then(data => {
        const productsArray = Object.values(data);
        setProducts(productsArray);
        setFilteredProducts(productsArray);
        setLoading(false);
      })
      .catch(error => console.error('Erro ao carregar os produtos:', error));
  }, []);

  const handleSort = (type) => {
    let sortedProducts = [...filteredProducts];
    if (type === sortType) {
      sortedProducts.reverse();
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortDirection('asc');
      if (type === 'name') {
        sortedProducts.sort((a, b) => a.nome.localeCompare(b.nome));
      } else if (type === 'price') {
        sortedProducts.sort((a, b) => a.preco - b.preco);
      }
      setSortType(type);
    }
    setFilteredProducts(sortedProducts);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = products.filter(product =>
      product.nome.toLowerCase().includes(text.toLowerCase()) ||
      product.descricao.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar produto"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <View style={styles.sortButtons}>
      <TouchableOpacity
          style={[styles.sortButton, sortType === 'name' && styles.activeSortButton]}
          onPress={() => handleSort('name')}
        >
          <Text style={styles.sortButtonText}>Ordenar por Nome {sortType === 'name' && sortDirection === 'asc' ? '↓' : '↑'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortType === 'price' && styles.activeSortButton]}
          onPress={() => handleSort('price')}
        >
          <Text style={styles.sortButtonText}>Ordenar por Preço {sortType === 'price' && sortDirection === 'asc' ? '↓' : '↑'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  activeSortButton: {
    backgroundColor: '#007bff',
  },
  sortButtonText: {
    color: '#333',
    textAlign: 'center',
  },
  productList: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
