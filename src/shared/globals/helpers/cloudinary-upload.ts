import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

export const cloudinaryUpload = async (
	file: string,
	public_id?: string,
	overwrite?: boolean,
	invalidate?: boolean,
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
	const result = await cloudinary.v2.uploader.upload(
		file,
		{
			public_id,
			overwrite,
			invalidate,
		},
		error => {
			if (error) {
				return error
			}
		},
	)
	return result
}
