import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {
  AuthResponse,
  LoginRequest,
  Donation,
  CreateDonationRequest,
  VillageRequest,
  CreateVillageRequestRequest,
  Ngo,
  Worker,
  PlatformStats,
  MatchSuggestion,
} from "@setu/shared";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequest) =>
      api.post<{ success: boolean; data: AuthResponse }>("/auth/login", body).then((r) => r.data.data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<{ success: boolean; data: AuthResponse }>("/auth/register", body).then((r) => r.data.data),
  });

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((r) => r.data.data),
  });

// ─── Donor ────────────────────────────────────────────────────────────────────
export const useMyDonations = () =>
  useQuery<Donation[]>({
    queryKey: ["my-donations"],
    queryFn: () => api.get("/donations/mine").then((r) => r.data.data),
  });

export const useDonorStats = () =>
  useQuery({
    queryKey: ["donor-stats"],
    queryFn: () => api.get("/donations/stats").then((r) => r.data.data),
  });

export const useCreateDonation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDonationRequest) =>
      api.post("/donations", body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-donations"] });
      qc.invalidateQueries({ queryKey: ["donor-stats"] });
    },
  });
};

// ─── Village ──────────────────────────────────────────────────────────────────
export const useMyVillageRequests = () =>
  useQuery<VillageRequest[]>({
    queryKey: ["my-village-requests"],
    queryFn: () => api.get("/villages/requests/mine").then((r) => r.data.data),
  });

export const useVillageStats = () =>
  useQuery({
    queryKey: ["village-stats"],
    queryFn: () => api.get("/villages/stats").then((r) => r.data.data),
  });

export const useCreateVillageRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateVillageRequestRequest) =>
      api.post("/villages/requests", body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-village-requests"] });
      qc.invalidateQueries({ queryKey: ["village-stats"] });
    },
  });
};

// ─── NGO ──────────────────────────────────────────────────────────────────────
export const useNgoProfile = () =>
  useQuery<Ngo>({
    queryKey: ["ngo-profile"],
    queryFn: () => api.get("/ngos/profile").then((r) => r.data.data),
  });

export const useNgoStats = () =>
  useQuery({
    queryKey: ["ngo-stats"],
    queryFn: () => api.get("/ngos/stats").then((r) => r.data.data),
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post("/ngos/projects", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ngo-profile"] }),
  });
};

// ─── Worker ───────────────────────────────────────────────────────────────────
export const useWorkerProfile = () =>
  useQuery<Worker>({
    queryKey: ["worker-profile"],
    queryFn: () => api.get("/workers/profile").then((r) => r.data.data),
  });

export const useActiveAssignment = () =>
  useQuery({
    queryKey: ["active-assignment"],
    queryFn: () => api.get("/workers/assignment/active").then((r) => r.data.data),
  });

export const useUpdateAssignmentProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, progressPercent }: { assignmentId: string; progressPercent: number }) =>
      api.patch(`/workers/assignment/${assignmentId}/progress`, { progressPercent }).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["active-assignment"] }),
  });
};

// ─── Platform ─────────────────────────────────────────────────────────────────
export const usePlatformStats = () =>
  useQuery<PlatformStats>({
    queryKey: ["platform-stats"],
    queryFn: () => api.get("/platform/stats").then((r) => r.data.data),
  });

export const useMatchSuggestions = () =>
  useQuery<MatchSuggestion[]>({
    queryKey: ["match-suggestions"],
    queryFn: () => api.get("/platform/match-suggestions").then((r) => r.data.data),
  });

export const useAllNgos = () =>
  useQuery<Ngo[]>({
    queryKey: ["all-ngos"],
    queryFn: () => api.get("/ngos").then((r) => r.data.data),
  });

export const useAllVillageRequests = () =>
  useQuery<VillageRequest[]>({
    queryKey: ["all-village-requests"],
    queryFn: () => api.get("/villages/requests").then((r) => r.data.data),
  });

export const useAllDonations = () =>
  useQuery<Donation[]>({
    queryKey: ["all-donations"],
    queryFn: () => api.get("/donations").then((r) => r.data.data),
  });

export const useAvailableWorkers = () =>
  useQuery<Worker[]>({
    queryKey: ["available-workers"],
    queryFn: () => api.get("/workers/available").then((r) => r.data.data),
  });

export const useMatchDonation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { donationId: string; villageRequestId: string }) =>
      api.post("/donations/match", body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-donations"] });
      qc.invalidateQueries({ queryKey: ["all-village-requests"] });
      qc.invalidateQueries({ queryKey: ["match-suggestions"] });
      qc.invalidateQueries({ queryKey: ["platform-stats"] });
    },
  });
};

export const useUpdateNgoVerification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ngoId, status }: { ngoId: string; status: string }) =>
      api.patch(`/ngos/${ngoId}/verify`, { status }).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-ngos"] }),
  });
};

export const useAssignWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, string>) =>
      api.post("/workers/assign", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["available-workers"] }),
  });
};
