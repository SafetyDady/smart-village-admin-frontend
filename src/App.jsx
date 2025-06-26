import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VillageList from './components/VillageList'
import HealthStatus from './components/HealthStatus'
import { useVillages } from './hooks/useVillages'
import './App.css'

function App() {
  const {
    villages,
    loading,
    error,
    fetchVillages,
    createVillage,
    updateVillage,
    deleteVillage,
  } = useVillages();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏘️ Smart Village Management System
          </h1>
          <p className="text-xl text-gray-600">
            ระบบจัดการหมู่บ้านอัจฉริยะ - Admin Dashboard
          </p>
        </div>

        <Tabs defaultValue="villages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="villages" className="text-lg">
              จัดการหมู่บ้าน
            </TabsTrigger>
            <TabsTrigger value="status" className="text-lg">
              สถานะระบบ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="villages" className="space-y-6">
            <VillageList 
              villages={villages}
              loading={loading}
              error={error}
              onRefresh={fetchVillages}
              onCreate={createVillage}
              onUpdate={updateVillage}
              onDelete={deleteVillage}
            />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <HealthStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

