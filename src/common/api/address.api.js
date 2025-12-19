import { apiClient } from "@/common/client";

export const createAddress = async (payload) =>
  await apiClient("/api/addresses", {
    method: "POST",
    body: payload,
  });

export const getMyAddresses = async () => {
  const { data } = await apiClient("/api/addresses");
  return data;
};

export const updateAddress = async (addressId, payload) =>
  await apiClient(`/api/addresses/${addressId}`, {
    method: "PUT",
    body: payload,
  });

export const deleteAddress = async (addressId) =>
  await apiClient(`/api/addresses/${addressId}`, {
    method: "DELETE",
  });

export const getAddressDetail = async (addressId) => {
  const { data } = await apiClient(`/api/addresses/${addressId}`);
  return data;
};

export const getDefaultAddress = async (addressId) => {
  const { data } = await apiClient(`/api/addresses/${addressId}`);
  return data;
};
