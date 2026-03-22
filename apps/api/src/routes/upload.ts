import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import crypto from 'crypto';

const router = Router();

/**
 * POST /api/v1/upload/presign — Generate a presigned URL for image upload
 *
 * In production, this would generate a presigned S3/R2 URL.
 * For local dev, it returns a mock URL that the client can use.
 *
 * TODO: Integrate with AWS S3 or Cloudflare R2 when ready.
 */
router.post(
  '/presign',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileExtension = (req.body.contentType ?? 'image/jpeg').split('/')[1] ?? 'jpg';
      const key = `items/${req.user!.id}/${crypto.randomUUID()}.${fileExtension}`;

      // TODO: Replace with real S3 presigned URL generation:
      // const command = new PutObjectCommand({ Bucket, Key: key, ContentType });
      // const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      const baseUrl = process.env.S3_ENDPOINT ?? 'https://storage.closet.app';
      const uploadUrl = `${baseUrl}/${key}?X-Mock-Presign=true`;
      const publicUrl = `${baseUrl}/${key}`;

      res.json({
        data: {
          uploadUrl,
          publicUrl,
          key,
          expiresIn: 300,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
