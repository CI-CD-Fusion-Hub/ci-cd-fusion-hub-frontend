#!/bin/bash

DIST_DIR=/app
vue_app_vars=()

# Iterate through environment variables
for var in $(env | grep '^VITE_'); do
    vue_app_vars+=("$var")
done

# Define a function to replace variables in a file
replace_variables() {
    local file="$1"
    for var in "${vue_app_vars[@]}"; do
        local var_name="${var%%=*}"
        local var_value="${var#*=}"
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