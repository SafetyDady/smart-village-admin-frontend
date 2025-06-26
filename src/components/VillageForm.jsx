import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

const VillageForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  village = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const isEditing = Boolean(village);

  // Reset form when dialog opens/closes or village changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: village?.name || '' });
      setErrors({});
      setSubmitError('');
    }
  }, [isOpen, village]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณาระบุชื่อหมู่บ้าน';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'ชื่อหมู่บ้านต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'ชื่อหมู่บ้านต้องไม่เกิน 255 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const trimmedData = { name: formData.name.trim() };
      await onSubmit(trimmedData);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'แก้ไขข้อมูลหมู่บ้าน' : 'เพิ่มหมู่บ้านใหม่'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'แก้ไขข้อมูลหมู่บ้านในระบบ' 
              : 'เพิ่มหมู่บ้านใหม่เข้าสู่ระบบการจัดการ'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อหมู่บ้าน *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="ระบุชื่อหมู่บ้าน"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มหมู่บ้าน'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VillageForm;

