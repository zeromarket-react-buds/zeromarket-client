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

export const updateAddress = (addressId, payload) =>
  apiClient(`/api/addresses/${addressId}`, {
    method: "PUT",
    body: payload,
  });

export const deleteAddress = (addressId) =>
  apiClient(`/api/addresses/${addressId}`, {
    method: "DELETE",
  });

export const getAddressDetail = async (addressId) => {
  const { data } = await apiClient(`/api/addresses/${addressId}`);
  return data;
};
