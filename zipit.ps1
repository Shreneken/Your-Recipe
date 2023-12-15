$files = Get-ChildItem -Path . -File 

$directories = Get-ChildItem -Path . -Recurse -Directory -Exclude node_modules, .env, .git

Compress-Archive -Path $($files + $directories) -DestinationPath final-proj.zip