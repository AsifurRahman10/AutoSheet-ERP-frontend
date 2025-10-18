import { ChevronLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { z } from 'zod'
import { useFormAction } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  gender: z.enum(['male', 'female']),
  role: z.enum(['admin', 'manager', 'staff']),
  designation: z.enum(['junior', 'senior', 'lead']),
  staffId: z.string().min(1, 'Staff ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  photo: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>

export const AddUser = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useFormAction<FormData>({
    resolver: zodResolver(formSchema),
  })
  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form data:', data)
      // Your API call here
      // await api.addStaff(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer bg-transparent border-none shadow-none ml-6 gap-0 hover:bg-transparent hover:border-none hover:shadow-none hover:text-current"
      >
        <ChevronLeft className="w-10 h-10 text-blue-600" />
        <span className="text-lg">Back</span>
      </Button>
      <div className="bg-white mt-8 mx-4 px-5 py-4 my-6 rounded-2xl">
        <h2 className="text-2xl font-semibold">Add new Staff</h2>
        <div className="mt-16">
          <form onSubmit={handleSubmit} className="flex gap-8">
            {/* Left Side - Photo Upload */}
            <div className="flex-shrink-0 w-64 border flex flex-col justify-center items-center rounded-md">
              <div className="bg-muted border rounded-full w-48 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors relative overflow-hidden">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {photoPreview ? (
                  <img
                    src={photoPreview || '/placeholder.svg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-muted-foreground">
                      Upload photo
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-foreground mb-2">
                  Allowed format
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  JPG, JPEG, and PNG
                </p>
                <p className="text-sm font-medium text-foreground mb-1">
                  Max file size
                </p>
                <p className="text-xs text-muted-foreground">2MB</p>
              </div>
            </div>

            {/* Right Side - Form Fields */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium mb-2 block"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    className="bg-background border-input h-[50px]"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium mb-2 block"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    className="bg-background border-input h-[50px]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium mb-2 block"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className="bg-background border-input h-[50px]"
                  />
                </div>

                <div className="flex gap-2">
                  {/* Gender */}
                  <div className="flex-1">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium mb-2 block"
                    >
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange('gender', value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input w-full h-[50px]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role */}
                  <div className="flex-1">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium mb-2 block"
                    >
                      Role
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleSelectChange('role', value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input w-full h-[50px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Designation */}
                  <div className="flex-1">
                    <Label
                      htmlFor="designation"
                      className="text-sm font-medium mb-2 block"
                    >
                      Designation
                    </Label>
                    <Select
                      value={formData.designation}
                      onValueChange={(value) =>
                        handleSelectChange('designation', value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input w-full h-[50px]">
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Second Phone Number */}
                <div>
                  <Label
                    htmlFor="secondPhone"
                    className="text-sm font-medium mb-2 block"
                  >
                    Phone number
                  </Label>
                  <Input
                    id="secondPhone"
                    name="secondPhone"
                    placeholder="Enter phone number"
                    value={formData.secondPhone}
                    onChange={handleInputChange}
                    className="bg-background border-input h-[50px]"
                  />
                </div>

                {/* Staff ID */}
                <div>
                  <Label
                    htmlFor="staffId"
                    className="text-sm font-medium mb-2 block"
                  >
                    Staff ID
                  </Label>
                  <Input
                    id="staffId"
                    name="staffId"
                    placeholder="Staff ID"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    className="bg-background border-input h-[50px]"
                  />
                </div>

                {/* Official Email */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Official Email"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-background border-input h-[50px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg h-[50px]"
                >
                  Add Staff
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
