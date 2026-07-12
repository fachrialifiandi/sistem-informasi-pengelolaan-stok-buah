// Mock local singleton state to simulate real database changes
let mockInventory = [
  {
    id_buah: 1,
    nama_buah: "Apel Fuji",
    sku: "1042",
    current_stock: 124.5,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r"
  },
  {
    id_buah: 2,
    nama_buah: "Pisang Cavendish",
    sku: "2012",
    current_stock: 0.0,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB"
  },
  {
    id_buah: 3,
    nama_buah: "Jeruk Sunkist",
    sku: "3022",
    current_stock: 2.8,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9mb0OYoRvZAtIKrX5H7-sAIecs7FTDG-_sbgl8L3mZgHuxnp3c5vNSEEozygWMpi9CQnh1YEzTOlLYym56nrsqAOxjxrRmVn-P9Vj-gRykjEWQYhDRzH_CIx4Xm6iT1RprCR66xf_NL6SKqAHCR2dWg1PNwZPMoHA3VO_A60qB47_AqN_JtWd3wEk9Xa97ee5AYw171u2aB51FSAhW80LWd4grbSf_xAiBiL_INH-OYEhNrc70q-z"
  },
  {
    id_buah: 4,
    nama_buah: "Anggur Merah",
    sku: "4055",
    current_stock: 12.5,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIj4W5Ao2H5GbcVdaffIFO7CvDIkRYQ_k09wc_AApZd9JmN7lywRSRZN_RNhaM_cf5bwz-p8EdGvO5Iw57VOl8eBLrux7FE9mg4F7Fl3HiY2vnM5wEOZ7k7WNbrc6L6kkSBk1xVlY33_qZo5faSqMFK94MBs66EDMlgX1UR6TvZAfG92HY3sXJ3IooYo_NQW7SGFkhrCvpDpX6tiGfPKwzM0Ye0sbXUErjGoGesGb79TvIb1YzFuU3"
  },
  {
    id_buah: 5,
    nama_buah: "Eureka Lemons",
    sku: "2011",
    current_stock: 12.0,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcr0n8mytOWDyz46AlJfanRwU4DSiDOt9DvTa7ITeCza-PG6QOoWCrGWfzxNjZaz5oIgr1-YRGWyOzln1IK-BINHiYQltPS_9gzI1b0IWct04BBzkRWx2WL41QorNuBFAiZBvlzfCaq0SjMS8hNtCXgMNK8hAtTCS4fA4GBtqx3sSl0ou2nQfBfwkgr9qCwG45mR5JuARwCtsNrqWDv4_zTGE_mWC9ozsTLs38r7HpQdKsUyIco_i0"
  },
  {
    id_buah: 6,
    nama_buah: "Gold Pineapple",
    sku: "3055",
    current_stock: 85.0,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdTdVFvM8wfEteI2A4wuRSK91eFhHr3EBTmHdOCYJinEYvXYc7CC3qnuqxlkzb8ItWEKHR9WZPlAqIS46-Y4tt-c9GuQLNzQa5y8XiHhlNIwgfSEVGBzdwyNa0CjFEyjSvKKAJ58a1FfySIpIB8RRmBDqWDWgvCRD0aqxc4LTuZVrduQ6HQXLfucSNolPSvB3gUZHfCy5L-cflTbbstjyg5H4AwufLIOLgbM_ju7Zk48IJZGDs19hT"
  },
  {
    id_buah: 7,
    nama_buah: "Blueberries",
    sku: "4092",
    current_stock: 0.0,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmO09yNJ8F4-wzk9k4suHeRnevCzcriTHcSC2UEaS6FcP-bbKDThwNrdc22lF4NG41lGl9YyN_gJI9E1Y9bNBRpp8smf_gKTGLdbimF3VBV3XMvBVPQlHowWNOcRfBO90Evmtcwxgoqsj72DVdku8pfWUdRGTzhoajk_QMh9-f7_nfttxIp1D-Lb0hI_L9poTvuOV-cY3SqHA_BKS3fXF547Ynzky5__F07miG1HfuIWoAiOjwr753"
  }
];

const mockSuppliers = [
  { id_supplier: 1, nama_supplier: "Sinar Jaya Orchards", no_telp: "08123456789" },
  { id_supplier: 2, nama_supplier: "Mitra Tani Sejahtera", no_telp: "08234567890" },
  { id_supplier: 3, nama_supplier: "Kebun Segar Abadi", no_telp: "08345678901" },
  { id_supplier: 4, nama_supplier: "Import Fruit Hub", no_telp: "08456789012" }
];

let mockTransactions = [
  {
    id_transaksi: "TRX-FV-20260712-042",
    supplier_name: "Sinar Jaya Orchards",
    time_str: "12:45 WIB",
    date_group: "Hari Ini",
    total_weight: 450.5,
    status: "Berhasil",
    type: "incoming",
    items: [
      { nama_buah: "Apel Fuji", sku: "1042", jumlah: 250, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r" },
      { nama_buah: "Pisang Cavendish", sku: "2012", jumlah: 200.5, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB" }
    ]
  },
  {
    id_transaksi: "TRX-FV-20260712-009",
    supplier_name: "Koperasi Tani Makmur",
    time_str: "09:15 WIB",
    date_group: "Hari Ini",
    total_weight: 1200.0,
    status: "Diproses",
    type: "outgoing",
    items: [
      { nama_buah: "Jeruk Sunkist", sku: "3022", jumlah: 600, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9mb0OYoRvZAtIKrX5H7-sAIecs7FTDG-_sbgl8L3mZgHuxnp3c5vNSEEozygWMpi9CQnh1YEzTOlLYym56nrsqAOxjxrRmVn-P9Vj-gRykjEWQYhDRzH_CIx4Xm6iT1RprCR66xf_NL6SKqAHCR2dWg1PNwZPMoHA3VO_A60qB47_AqN_JtWd3wEk9Xa97ee5AYw171u2aB51FSAhW80LWd4grbSf_xAiBiL_INH-OYEhNrc70q-z" },
      { nama_buah: "Anggur Merah", sku: "4055", jumlah: 600, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIj4W5Ao2H5GbcVdaffIFO7CvDIkRYQ_k09wc_AApZd9JmN7lywRSRZN_RNhaM_cf5bwz-p8EdGvO5Iw57VOl8eBLrux7FE9mg4F7Fl3HiY2vnM5wEOZ7k7WNbrc6L6kkSBk1xVlY33_qZo5faSqMFK94MBs66EDMlgX1UR6TvZAfG92HY3sXJ3IooYo_NQW7SGFkhrCvpDpX6tiGfPKwzM0Ye0sbXUErjGoGesGb79TvIb1YzFuU3" }
    ]
  },
  {
    id_transaksi: "TRX-FV-20260711-094",
    supplier_name: "Global Tropical Fruit",
    time_str: "16:20 WIB",
    date_group: "Kemarin",
    total_weight: 85.2,
    status: "Berhasil",
    type: "incoming",
    items: [
      { nama_buah: "Eureka Lemons", sku: "2011", jumlah: 40.2, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcr0n8mytOWDyz46AlJfanRwU4DSiDOt9DvTa7ITeCza-PG6QOoWCrGWfzxNjZaz5oIgr1-YRGWyOzln1IK-BINHiYQltPS_9gzI1b0IWct04BBzkRWx2WL41QorNuBFAiZBvlzfCaq0SjMS8hNtCXgMNK8hAtTCS4fA4GBtqx3sSl0ou2nQfBfwkgr9qCwG45mR5JuARwCtsNrqWDv4_zTGE_mWC9ozsTLs38r7HpQdKsUyIco_i0" },
      { nama_buah: "Gold Pineapple", sku: "3055", jumlah: 45, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdTdVFvM8wfEteI2A4wuRSK91eFhHr3EBTmHdOCYJinEYvXYc7CC3qnuqxlkzb8ItWEKHR9WZPlAqIS46-Y4tt-c9GuQLNzQa5y8XiHhlNIwgfSEVGBzdwyNa0CjFEyjSvKKAJ58a1FfySIpIB8RRmBDqWDWgvCRD0aqxc4LTuZVrduQ6HQXLfucSNolPSvB3gUZHfCy5L-cflTbbstjyg5H4AwufLIOLgbM_ju7Zk48IJZGDs19hT" }
    ]
  },
  {
    id_transaksi: "TRX-FV-20260711-011",
    supplier_name: "Petani Mangga Arumanis",
    time_str: "14:00 WIB",
    date_group: "Kemarin",
    total_weight: 312.0,
    status: "Berhasil",
    type: "incoming",
    items: [
      { nama_buah: "Blueberries", sku: "4092", jumlah: 112, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmO09yNJ8F4-wzk9k4suHeRnevCzcriTHcSC2UEaS6FcP-bbKDThwNrdc22lF4NG41lGl9YyN_gJI9E1Y9bNBRpp8smf_gKTGLdbimF3VBV3XMvBVPQlHowWNOcRfBO90Evmtcwxgoqsj72DVdku8pfWUdRGTzhoajk_QMh9-f7_nfttxIp1D-Lb0hI_L9poTvuOV-cY3SqHA_BKS3fXF547Ynzky5__F07miG1HfuIWoAiOjwr753" },
      { nama_buah: "Apel Fuji", sku: "1042", jumlah: 200, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r" }
    ]
  }
];

const mockDailyMovements = [
  {
    day_abbr: "SEN",
    day_num: "22",
    month: "Mei",
    title: "Senin Teratur",
    desc: "8 Produk diperbarui",
    stock_in: 150,
    stock_out: 120
  },
  {
    day_abbr: "SEL",
    day_num: "23",
    month: "Mei",
    title: "Update Stok Buah Tropis",
    desc: "12 Produk diperbarui",
    stock_in: 340,
    stock_out: 210
  },
  {
    day_abbr: "RAB",
    day_num: "24",
    month: "Mei",
    title: "Pengiriman Restoran",
    desc: "5 Produk diperbarui",
    stock_in: 0,
    stock_out: 450
  }
];

export const inventoryService = {
  /**
   * Fetch current inventory items with stock level metadata.
   */
  async getInventory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemsWithStatus = mockInventory.map(item => {
          let status = "High Stock";
          if (item.current_stock === 0) {
            status = "Out of Stock";
          } else if (item.current_stock <= 15) {
            status = "Low Stock";
          }
          return { ...item, status };
        });
        resolve(itemsWithStatus);
      }, 300);
    });
  },

  /**
   * Fetch list of active suppliers for restocking.
   */
  async getSuppliers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSuppliers);
      }, 200);
    });
  },

  /**
   * Fetch all mock transaction logs.
   */
  async getTransactions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 300);
    });
  },

  /**
   * Fetch monthly stock stats (in/out) and daily movement breakdowns.
   */
  async getStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total_stock_in: 1240,
          total_stock_out: 985,
          movements: mockDailyMovements
        });
      }, 300);
    });
  },

  /**
   * Submit restock transaction, updating mock database state and creating transaction history logs.
   */
  async postRestock({ id_supplier, items }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!id_supplier || !items || items.length === 0) {
          reject(new Error("Pemasok dan item wajib diisi."));
          return;
        }

        // Apply restock changes to in-memory mockInventory
        items.forEach(restockItem => {
          const target = mockInventory.find(i => i.id_buah === restockItem.id_buah);
          if (target) {
            target.current_stock = parseFloat((target.current_stock + restockItem.jumlah).toFixed(2));
          }
        });

        // Insert new transaction entry to history
        const supplierObj = mockSuppliers.find(s => s.id_supplier === id_supplier);
        const supplierName = supplierObj ? supplierObj.nama_supplier : "Supplier Lain";
        const totalWeight = items.reduce((sum, item) => sum + item.jumlah, 0);
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // Map restock items to transaction nested details
        const itemDetails = items.map(ri => {
          const target = mockInventory.find(i => i.id_buah === ri.id_buah);
          return {
            nama_buah: target ? target.nama_buah : "Buah Misterius",
            sku: target ? target.sku : "0000",
            jumlah: ri.jumlah,
            image: target ? target.image : "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r"
          };
        });

        mockTransactions.unshift({
          id_transaksi: `TRX-FV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(100 + Math.random() * 900)}`,
          supplier_name: supplierName,
          time_str: `${hours}:${minutes} WIB`,
          date_group: "Hari Ini",
          total_weight: parseFloat(totalWeight.toFixed(2)),
          status: "Berhasil",
          type: "incoming",
          items: itemDetails
        });

        resolve({ success: true, message: "Restok berhasil dikonfirmasi!" });
      }, 400);
    });
  },

  /**
   * Add a new fruit to the local inventory store.
   */
  async addFruit({ sku, name, initialStock }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!sku || !name) {
          reject(new Error("Fruit ID dan Nama Buah wajib diisi."));
          return;
        }

        const exists = mockInventory.find(i => i.sku.toLowerCase() === sku.toLowerCase() || i.nama_buah.toLowerCase() === name.toLowerCase());
        if (exists) {
          reject(new Error("Fruit ID atau Nama Buah sudah ada."));
          return;
        }

        const randomImages = [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB"
        ];
        const randomImg = randomImages[Math.floor(Math.random() * randomImages.length)];

        mockInventory.push({
          id_buah: mockInventory.length + 1,
          nama_buah: name,
          sku: sku,
          current_stock: parseFloat(initialStock) || 0.0,
          unit: "kg",
          image: randomImg
        });

        resolve({ success: true });
      }, 400);
    });
  },

  /**
   * Update an existing fruit details.
   */
  async updateFruit(id_buah, { name, stock }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const target = mockInventory.find(i => i.id_buah === id_buah);
        if (!target) {
          reject(new Error("Buah tidak ditemukan."));
          return;
        }

        target.nama_buah = name;
        target.current_stock = parseFloat(stock) || 0.0;

        resolve({ success: true });
      }, 400);
    });
  }
};
