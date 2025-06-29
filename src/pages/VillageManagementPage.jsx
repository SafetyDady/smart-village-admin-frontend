import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Users, Building, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

const VillageManagementPage = () => {
  const { user, hasPermission } = useAuth();
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);

  // Sample data for development
  const sampleVillages = [
    {
      id: 'village-sv001',
      name: 'หมู่บ้านสมาร์ทวิลเลจ 1',
      code: 'SV001',
      description: 'หมู่บ้านต้นแบบสมาร์ทวิลเลจ',
      address: '123 ถนนสมาร์ท',
      province: 'กรุงเทพมหานคร',
      district: 'เขตบางรัก',
      sub_district: 'แขวงสีลม',
      postal_code: '10500',
      total_properties: 150,
      total_residents: 420,
      is_active: true,
      is_verified: true,
      contact_person: 'นายสมชาย ใจดี',
      contact_phone: '02-123-4567',
      contact_email: 'contact@sv001.com',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'village-sv002',
      name: 'หมู่บ้านเทคโนโลยี',
      code: 'SV002',
      description: 'หมู่บ้านที่ใช้เทคโนโลยีสมัยใหม่',
      address: '456 ถนนเทคโนโลยี',
      province: 'เชียงใหม่',
      district: 'เมืองเชียงใหม่',
      sub_district: 'ตำบลสุเทพ',
      postal_code: '50200',
      total_properties: 200,
      total_residents: 580,
      is_active: true,
      is_verified: true,
      contact_person: 'นางสาวสุดา เก่งเทค',
      contact_phone: '053-987-6543',
      contact_email: 'info@sv002.com',
      created_at: '2024-02-20T14:15:00Z'
    },
    {
      id: 'village-sv003',
      name: 'หมู่บ้านอีโค',
      code: 'SV003',
      description: 'หมู่บ้านเป็นมิตรกับสิ่งแวดล้อม',
      address: '789 ถนนธรรมชาติ',
      province: 'ภูเก็ต',
      district: 'เมืองภูเก็ต',
      sub_district: 'ตำบลรัษฎา',
      postal_code: '83000',
      total_properties: 120,
      total_residents: 350,
      is_active: true,
      is_verified: false,
      contact_person: 'นายธรรมชาติ รักษ์โลก',
      contact_phone: '076-555-1234',
      contact_email: 'eco@sv003.com',
      created_at: '2024-03-10T09:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVillages(sampleVillages);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVillages = villages.filter(village => {
    const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         village.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         village.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = !selectedProvince || village.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  const provinces = [...new Set(villages.map(v => v.province))];

  const VillageCard = ({ village }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {village.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              รหัส: {village.code}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={village.is_active ? "default" : "secondary"}>
              {village.is_active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
            </Badge>
            <Badge variant={village.is_verified ? "success" : "warning"}>
              {village.is_verified ? 'ยืนยันแล้ว' : 'รอยืนยัน'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 line-clamp-2">
            {village.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{village.province}, {village.district}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              <span>{village.total_properties} ทรัพย์สิน</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span>{village.total_residents} ผู้อยู่อาศัย</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            ติดต่อ: {village.contact_person} | {village.contact_phone}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              ดูรายละเอียด
            </Button>
            {hasPermission('villages.update') && (
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                แก้ไข
              </Button>
            )}
            {hasPermission('villages.delete') && (
              <Button size="sm" variant="destructive" className="flex-1">
                <Trash2 className="h-4 w-4 mr-1" />
                ลบ
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VillageStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">หมู่บ้านทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{villages.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">หมู่บ้านที่ใช้งาน</p>
              <p className="text-2xl font-bold text-green-600">
                {villages.filter(v => v.is_active).length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ทรัพย์สินรวม</p>
              <p className="text-2xl font-bold text-blue-600">
                {villages.reduce((sum, v) => sum + v.total_properties, 0)}
              </p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้อยู่อาศัยรวม</p>
              <p className="text-2xl font-bold text-purple-600">
                {villages.reduce((sum, v) => sum + v.total_residents, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการหมู่บ้าน</h1>
          <p className="text-gray-600 mt-1">จัดการข้อมูลหมู่บ้านในระบบ Smart Village</p>
        </div>
        {hasPermission('villages.create') && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มหมู่บ้านใหม่
          </Button>
        )}
      </div>

      {/* Statistics */}
      <VillageStats />

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาหมู่บ้าน (ชื่อ, รหัส, คำอธิบาย)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกจังหวัด</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Villages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillages.map(village => (
          <VillageCard key={village.id} village={village} />
        ))}
      </div>

      {filteredVillages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบหมู่บ้าน</h3>
            <p className="text-gray-600 mb-4">
              ไม่พบหมู่บ้านที่ตรงกับเงื่อนไขการค้นหา
            </p>
            {hasPermission('villages.create') && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มหมู่บ้านใหม่
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VillageManagementPage;

