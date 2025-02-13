docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY" \
  -e "MINIO_SECRET_KEY=$MINIO_SECRET_KEY" \
  -v /home/miguelmorujao/Downloads/minio/ \
  minio/minio server /data

