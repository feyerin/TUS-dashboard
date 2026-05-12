<template>
  <div class="space-y-6 min-h-screen">
    
    <!-- HEADER -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">
          Ecommerce Dashboard
        </h1>

        <p class="text-gray-500 mt-1">
          Welcome back, Here's what's happening today.
        </p>
      </div>

      <a-button type="primary" size="large">
        + Add Product
      </a-button>
    </div>

    <!-- STATS -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">
                Total Revenue
              </p>

              <h2 class="text-3xl font-bold mt-2">
                Rp 245M
              </h2>

              <span class="text-green-500 text-sm">
                +12.5%
              </span>
            </div>

            <div
              class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl"
            >
              <Icon name="lucide:wallet" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">
                Orders
              </p>

              <h2 class="text-3xl font-bold mt-2">
                1,245
              </h2>

              <span class="text-green-500 text-sm">
                +8.2%
              </span>
            </div>

            <div
              class="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl"
            >
              <Icon name="lucide:shopping-bag" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">
                Customers
              </p>

              <h2 class="text-3xl font-bold mt-2">
                8,432
              </h2>

              <span class="text-green-500 text-sm">
                +4.1%
              </span>
            </div>

            <div
              class="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl"
            >
              <Icon name="lucide:users" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">
                Products
              </p>

              <h2 class="text-3xl font-bold mt-2">
                532
              </h2>

              <span class="text-red-500 text-sm">
                -1.4%
              </span>
            </div>

            <div
              class="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl"
            >
              <Icon name="lucide:package" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- MAIN CONTENT -->
    <a-row :gutter="[16, 16]">
      
      <!-- SALES -->
      <a-col :xs="24" :xl="16">
        <a-card
          title="Sales Overview"
          class="rounded-2xl shadow-sm h-full"
        >
          <div class="h-[350px] flex items-center justify-center text-gray-400">
            Chart Here
          </div>
        </a-card>
      </a-col>

      <!-- TOP PRODUCTS -->
      <a-col :xs="24" :xl="8">
        <a-card
          title="Top Products"
          class="rounded-2xl shadow-sm h-full"
        >
          <div class="space-y-4">
            <div
              v-for="product in topProducts"
              :key="product.name"
              class="flex items-center gap-4"
            >
              <img
                :src="product.image"
                class="w-14 h-14 rounded-xl object-cover"
              />

              <div class="flex-1">
                <h3 class="font-medium">
                  {{ product.name }}
                </h3>

                <p class="text-gray-500 text-sm">
                  {{ product.sales }} sales
                </p>
              </div>

              <span class="font-semibold">
                {{ product.price }}
              </span>
            </div>
          </div>
        </a-card>
      </a-col>

    </a-row>

    <!-- RECENT ORDERS -->
    <a-card
      title="Recent Orders"
      class="rounded-2xl shadow-sm"
    >
      <a-table
        :columns="columns"
        :data-source="orders"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">

          <template v-if="column.key === 'customer'">
            <div class="flex items-center gap-3">
              <a-avatar>
                {{ record.customer.charAt(0) }}
              </a-avatar>

              <span>{{ record.customer }}</span>
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag
              :color="
                record.status === 'Completed'
                  ? 'green'
                  : record.status === 'Pending'
                  ? 'orange'
                  : 'red'
              "
            >
              {{ record.status }}
            </a-tag>
          </template>

        </template>
      </a-table>
    </a-card>

  </div>
</template>

<script setup lang="ts">
const topProducts = [
  {
    name: 'Oversized Hoodie',
    sales: 124,
    price: 'Rp 899K',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
  },

  {
    name: 'Cargo Pants',
    sales: 98,
    price: 'Rp 699K',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246'
  },

  {
    name: 'Basic T-Shirt',
    sales: 87,
    price: 'Rp 299K',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
  }
]

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id'
  },

  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer'
  },

  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product'
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount'
  },

  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  }
]

const orders = [
  {
    id: '#10231',
    customer: 'John Doe',
    product: 'Oversized Hoodie',
    amount: 'Rp 899K',
    status: 'Completed'
  },

  {
    id: '#10232',
    customer: 'Michael',
    product: 'Cargo Pants',
    amount: 'Rp 699K',
    status: 'Pending'
  },

  {
    id: '#10233',
    customer: 'Sarah',
    product: 'Basic T-Shirt',
    amount: 'Rp 299K',
    status: 'Cancelled'
  },

  {
    id: '#10234',
    customer: 'Jessica',
    product: 'Sneakers',
    amount: 'Rp 1.2M',
    status: 'Completed'
  }
]
</script>