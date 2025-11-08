/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  gender: z.enum(['male', 'female', 'other']),
  role: z.enum(['admin', 'manager', 'staff']),
  designation: z.enum(['junior', 'senior', 'lead']),
  staffId: z.string().min(1, 'Staff ID is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/,
      'Password must contain at least one special character'
    ),
  photo: z.instanceof(File).optional(),
})

type FormData = z.infer<typeof formSchema>

export const AddUser = () => {
  const navigate = useNavigate()
  const { user, signUp } = useAuth()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadImageData, setUploadImageData] = useState({
    imageUrl: '',
    publicKey: '',
  })
  const [imageUploading, setImageUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: undefined,
      role: undefined,
      designation: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      // 1️⃣ Prepare full name and post data
      const fullName = `${data.firstName} ${data.lastName || ''}`.trim()
      const { firstName, lastName, ...rest } = data
      if (!uploadImageData.imageUrl)
        return toast.error('Please upload a profile picture.')
      const postData = {
        ...rest,
        name: fullName,
        profilePicture: {
          url: uploadImageData.imageUrl,
          public_id: uploadImageData.publicKey,
        },
        creator: user?.email, // or user?.email if available
      }

      // 2️⃣ Sign in the user
      const { data: signInData, error: signInError } = await signUp(
        data.email,
        data.password
      )
      if (signInError) throw new Error(signInError.message)
      // 3️⃣ Register user via API
      await api.post('/user/register-user', postData)

      // 4️⃣ Show success toast

      toast.success('Staff added successfully!')
      reset()
      setPhotoPreview(null)
      setUploadImageData({ imageUrl: '', publicKey: '' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // 5️⃣ Show error toast
      toast.error(err?.message || 'Something went wrong.')
      console.error(err)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploading(true)
    const file = e.target.files?.[0]

    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit.')
        return
      }
      try {
        const formData = new FormData()
        formData.append('imageUrl', file)

        const { data } = await api.post('/upload', formData)
        const uploadImage = data.data.imageUrl
        setPhotoPreview(uploadImage)
        const publicKey = data.data.publicKey
        setUploadImageData({ imageUrl: uploadImage, publicKey })
        setImageUploading(false)
        toast.success('Image uploaded successfully')
      } catch (error: any) {
        toast.error(error?.message || 'Image upload failed.')
      }
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Form field configuration for reusability
  const formFields = [
    {
      id: 'firstName',
      label: 'First name',
      placeholder: 'Enter first name',
      type: 'text',
    },
    {
      id: 'lastName',
      label: 'Last name',
      placeholder: 'Enter last name',
      type: 'text',
    },
    {
      id: 'email',
      label: 'Email address',
      placeholder: 'Enter email address',
      type: 'email',
    },
    {
      id: 'phone',
      label: 'Phone number',
      placeholder: 'Enter phone number',
      type: 'number',
    },
    {
      id: 'staffId',
      label: 'Staff ID',
      placeholder: 'Staff ID',
      type: 'number',
    },
    {
      id: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      type: 'password',
    },
  ] as const

  const selectOptions = {
    gender: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
    role: [
      { value: 'admin', label: 'Admin' },
      { value: 'manager', label: 'Manager' },
      { value: 'staff', label: 'Staff' },
    ],
    designation: [
      { value: 'junior', label: 'Junior' },
      { value: 'senior', label: 'Senior' },
      { value: 'lead', label: 'Lead' },
    ],
  }

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleBack}
        className="cursor-pointer bg-transparent border-none shadow-none ml-6 gap-0 hover:bg-transparent"
      >
        <ChevronLeft className="w-10 h-10 text-blue-600" />
        <span className="text-lg">Back</span>
      </Button>

      <div className="bg-white mt-8 mx-4 px-5 py-4 my-6 rounded-2xl">
        <h2 className="text-2xl font-semibold">Add new Staff</h2>

        <div className="mt-16">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
            {/* Left Side - Photo Upload */}
            <div className="flex-shrink-0 w-64 border flex flex-col justify-center items-center rounded-md p-4">
              <div className="bg-muted border rounded-full w-48 h-48 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors relative overflow-hidden">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : imageUploading ? (
                  <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                      <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                    <svg
                      className="w-12 h-12 mb-2"
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
                    <p className="text-sm font-medium">Upload photo</p>
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
                {/* Render text inputs dynamically */}
                {formFields.map((field) => (
                  <div key={field.id}>
                    <Label
                      htmlFor={field.id}
                      className="text-sm font-medium mb-2 block"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="bg-background border-input h-[50px]"
                      {...register(field.id as keyof FormData)}
                    />
                    {errors[field.id as keyof FormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.id as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                ))}

                {/* Select Fields Row */}
                <div className="col-span-2 flex gap-4">
                  {(['gender', 'role', 'designation'] as const).map((field) => (
                    <div key={field} className="flex-1">
                      <Label
                        htmlFor={field}
                        className="text-sm font-medium mb-2 block"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Select
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onValueChange={(value) => setValue(field, value as any)}
                      >
                        <SelectTrigger className="bg-background border-input w-full">
                          <SelectValue placeholder={`Select ${field}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectOptions[field].map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-br from-[#13add6] to-[#384295] text-white font-normal py-2 px-4 rounded-md hover:opacity-90 transition-opacity w-1/3"
                >
                  {isSubmitting ? 'Adding Staff...' : 'Add Staff'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
