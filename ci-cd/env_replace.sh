#!/bin/sh
DIST_DIR=/app

# Define a function to replace variables in a file
replace_variables() {
    local file="$1"
    for var in "$(env | grep '^VITE_')"; do
        local var_name="${var%%=*}"
        local var_value="${var#*=}"
        echo "REPLACE: ${var_name}_REPLACE ---> $var_value"
        sed -i "s#${var_name}_REPLACE#$var_value#g" "$file"
    done
}

# Iterate through .js files and replace environment variables
for file in $(find $DIST_DIR -type f -name "*.js"); do
    echo "Processing $file"
    replace_variables "$file"
done

# Let container execution proceed
exec "$@"