import api from './api';

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('/static')) {
    const baseUrl = api.defaults.baseURL || '';
    return `${baseUrl}${imageUrl}`;
  }
  return imageUrl;
};

export const inventoryService = {
  /**
   * Fetch current inventory items with stock level metadata.
   */
  async getInventory() {
    const response = await api.get('/api/v1/fruits/');
    return response.data.map(item => ({
      ...item,
      image: resolveImageUrl(item.image)
    }));
  },

  /**
   * Fetch list of active suppliers for restocking.
   */
  async getSuppliers() {
    const response = await api.get('/api/v1/suppliers/');
    return response.data;
  },

  /**
   * Fetch all transaction logs matching period.
   */
  async getTransactions(period) {
    const params = {};
    if (period) {
      params.period = period;
    }
    const response = await api.get('/api/v1/transactions/', { params });
    return response.data.map(tx => ({
      ...tx,
      items: tx.items?.map(item => ({
        ...item,
        image: resolveImageUrl(item.image)
      }))
    }));
  },

  /**
   * Fetch monthly stock stats (in/out) and daily movement breakdowns.
   */
  async getStats(period) {
    const params = {};
    if (period) {
      params.period = period;
    }
    const response = await api.get('/api/v1/stats/', { params });
    return response.data;
  },

  /**
   * Fetch itemized fruit summary data dynamically from live fruits list and transactions.
   */
  async getReportSummary(period) {
    const [fruits, transactions] = await Promise.all([
      this.getInventory(),
      this.getTransactions(period)
    ]);
    
    // Generate summaryData dynamically for each fruit
    return fruits.map(item => {
      let totalIn = 0;
      let totalOut = 0;

      transactions.forEach(t => {
        const fruitMatch = t.items?.find(f => f.nama_buah.toLowerCase() === item.nama_buah.toLowerCase() || f.sku === item.sku);
        if (fruitMatch) {
          if (t.type === "incoming" && t.status === "Berhasil") {
            totalIn += fruitMatch.jumlah;
          } else if (t.type === "outgoing") {
            totalOut += fruitMatch.jumlah;
          }
        }
      });

      return {
        id: item.id_buah,
        name: item.nama_buah,
        in: totalIn > 0 ? `+${totalIn.toFixed(1)}` : '0',
        out: totalOut > 0 ? `-${totalOut.toFixed(1)}` : '0',
        stock: item.current_stock.toFixed(1)
      };
    });
  },

  /**
   * Submit restock transaction, updating database state and creating transaction history logs.
   */
  async postRestock({ id_supplier, items }) {
    const response = await api.post('/api/v1/transactions/restock', { id_supplier, items });
    return response.data;
  },

  /**
   * Record outgoing stock (reduces stock and creates history logs).
   */
  async postOutgoingStock({ items, reason, notes }) {
    const response = await api.post('/api/v1/transactions/stock-out', { items, reason, notes });
    return response.data;
  },

  /**
   * Upload an image to the backend and return its relative URL path.
   */
  async uploadImage(imageUri) {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    const response = await api.post('/api/v1/fruits/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Add a new fruit to the database.
   */
  async addFruit({ sku, name, initialStock, image }) {
    const response = await api.post('/api/v1/fruits', {
      nama_buah: name,
      sku,
      current_stock: parseFloat(initialStock) || 0.0,
      unit: "kg",
      image: image
    });
    return response.data;
  },

  /**
   * Update an existing fruit details.
   */
  async updateFruit(id_buah, { name, stock, image }) {
    const response = await api.put(`/api/v1/fruits/${id_buah}`, {
      nama_buah: name,
      current_stock: parseFloat(stock) || 0.0,
      image: image
    });
    return response.data;
  },

  /**
   * Delete an existing fruit from the database.
   */
  async deleteFruit(id_buah) {
    const response = await api.delete(`/api/v1/fruits/${id_buah}`);
    return response.data;
  }
};
