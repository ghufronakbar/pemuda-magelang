import { S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY } from "@/constants/s3";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_KEY!,
    },
    forcePathStyle: true,
});