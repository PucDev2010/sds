import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UploadOutlined } from '@ant-design/icons'
import { RootState } from '~/store/store'

import customParttern from '~/constant/pattern'
import MeAvatar from '~/components/MeAvatar/MeAvatar'
import { getImageUrl, showMessageRespone } from '~/utils/utils'
import { Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import userApi from '~/api/user.api'
import { useDispatch } from 'react-redux'
import { setProfile } from '~/slices/userSlice'

function AvatarUpload() {
  const { profile } = useSelector((root: RootState) => root.user)
  const dispatch = useDispatch()
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [image, setImage] = useState('')
  const { t } = useTranslation()

  const { mutate, isLoading } = useMutation({
    mutationFn: (body: FormData) => {
      return userApi.updateAvatar(body)
    },
    onSuccess: (res) => {
      showMessageRespone(res.data)
      if (res.data.success) {
        setImageFile(undefined)
        setImage('')
        dispatch(setProfile({ ...profile, avatar: res.data.data.url }))
      }
    }
  })

  const handleUpload = async () => {
    if (imageFile) {
      const formData = new FormData()
      formData.append('avatar', imageFile)
      mutate(formData)
    } else {
      message.error(t('message:pleaseSelectImage'))
    }
  }

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length > 0 && files[0].type.match(customParttern.imageTypeRegex)) {
      setImageFile(files[0])
      return
    }
  }

  useEffect(() => {
    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile)
      setImage(imageURL)
    }
    return () => {
      URL.revokeObjectURL(image)
    }
  }, [imageFile])

  return (
    <>
      <div className='flex items-center justify-center flex-col'>
        <MeAvatar image={image} size={96} htmlFor='change-avatar' />
        <Button
          loading={isLoading}
          disabled={!!!image || isLoading}
          size='small'
          className='mt-3'
          icon={<UploadOutlined />}
          onClick={handleUpload}
        >
          {t('common:upload')}
        </Button>
      </div>
      <input
        className='hidden'
        id='change-avatar'
        type='file'
        accept='image/png, image/jpg, image/jpeg'
        onChange={changeHandler}
        disabled={isLoading}
      />
    </>
  )
}

export default AvatarUpload
