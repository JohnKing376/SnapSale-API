export function RESOURCE_FETCHED_SUCCESSFULLY(resourceName = 'Resource') {
  return `Fetched ${resourceName} successfully`;
}

export function RESOURCE_NOT_FOUND(resourceName = 'Resource') {
  return `${resourceName} Was not found`;
}

export function RESOURCE_LIST_FETCHED_SUCCESSFULLY(resourceName = 'Resource') {
  return `Fetched ${resourceName} list successfully`;
}

export function RESOURCE_LIST_FETCH_FAILED(resourceName = 'Resource') {
  return `Unable To Fetch ${resourceName} list`;
}

export function RESOURCE_ALREADY_EXIST(resourceName = 'Resource') {
  return `${resourceName} already exists`;
}
export function OPERATION_FAILED(operationName = 'Operation') {
  return `${operationName} Operation Failed`;
}

export function OPERATION_NOT_ALLOWED(reason = '') {
  return `Operation not allowed. ${reason}`;
}

export function OPERATION_IN_PROGRESS(operationName = 'Operation') {
  return `${operationName} Operation is in progress. Kindly wait for the operation to complete`;
}

export function OPERATION_SUCCESSFUL(operationName = 'Operation') {
  return `${operationName} Operation Successful`;
}

export function CREATE_RESOURCE_SUCCESSFUL(resourceName = 'Resource') {
  return `${resourceName} Created Successfully`;
}

export function CREATE_RESOURCE_FAIL(resourceName = 'Resource') {
  return `${resourceName} Create Fail`;
}

export function UPDATE_RESOURCE_SUCCESSFUL(resourceName = 'Resource') {
  return `${resourceName} Updated Successfully`;
}

export function UPDATE_RESOURCE_FAIL(resourceName = 'Resource') {
  return `${resourceName} Update Fail`;
}

export function DELETE_RESOURCE_SUCCESSFUL(resourceName = 'Resource') {
  return `${resourceName} Deleted Successfully`;
}

export function DELETE_RESOURCE_FAIL(resourceName = 'Resource') {
  return `${resourceName} Delete Fail`;
}
