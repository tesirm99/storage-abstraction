# 1.0.6

- small cosmetic code changes (no change in functionality)
- updated glob to 10.3.12

# 1.0.5

- fix bug in selected bucket

# 1.0.3

- revert to v1 format of config URLs
- re-implement storing the selected bucket in local state
  - `selectBucket` and `geSelectedBucket`
  - also implemented as getter
    `storage.bucketName = "the-buck";` and setter `console.log(storage.bucketName);`
