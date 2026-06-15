"use server";

import { revalidatePath } from "next/cache";
import {
  createAgent,
  createOrganization,
  createUser,
  updateAgent,
  updateOrganization,
} from "@/features/admin/server/admin-api";

export async function submitOrganization(formData: FormData) {
  await createOrganization({
    name: String(formData.get("name") ?? ""),
    countryCode: String(formData.get("countryCode") ?? "EC"),
    timezone: String(formData.get("timezone") ?? "America/Guayaquil"),
    plan: String(formData.get("plan") ?? "starter"),
    status: String(formData.get("status") ?? "active") as "active" | "inactive",
  });

  revalidatePath("/organizations");
  revalidatePath("/settings");
}

export async function submitOrganizationSettings(formData: FormData) {
  const organizationId = String(formData.get("organizationId") ?? "");

  if (!organizationId) {
    throw new Error("Missing organizationId.");
  }

  await updateOrganization(organizationId, {
    name: String(formData.get("name") ?? ""),
    countryCode: String(formData.get("countryCode") ?? ""),
    timezone: String(formData.get("timezone") ?? ""),
    plan: String(formData.get("plan") ?? ""),
    status: String(formData.get("status") ?? "active") as "active" | "inactive",
  });

  revalidatePath("/organizations");
  revalidatePath("/settings");
}

export async function submitUser(formData: FormData) {
  await createUser({
    organizationId: String(formData.get("organizationId") ?? ""),
    email: String(formData.get("email") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "viewer") as
      | "owner"
      | "admin"
      | "operator"
      | "auditor"
      | "viewer"
      | "integrator",
    status: String(formData.get("status") ?? "active") as "active" | "inactive",
  });

  revalidatePath("/users");
}

export async function submitAgent(formData: FormData) {
  await createAgent({
    organizationId: String(formData.get("organizationId") ?? ""),
    name: String(formData.get("name") ?? ""),
    agentType: String(formData.get("agentType") ?? ""),
    source: String(formData.get("source") ?? "manual"),
    description: String(formData.get("description") ?? ""),
    autonomyLevel: String(formData.get("autonomyLevel") ?? "supervised") as
      | "read_only"
      | "supervised"
      | "limited_write"
      | "autonomous",
    status: String(formData.get("status") ?? "active") as "active" | "inactive",
  });

  revalidatePath("/agents");
  revalidatePath("/settings");
}

export async function submitAgentUpdate(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "");

  if (!agentId) {
    throw new Error("Missing agentId.");
  }

  await updateAgent(agentId, {
    autonomyLevel: String(formData.get("autonomyLevel") ?? "supervised") as
      | "read_only"
      | "supervised"
      | "limited_write"
      | "autonomous",
    status: String(formData.get("status") ?? "active") as "active" | "inactive",
  });

  revalidatePath("/agents");
  revalidatePath("/settings");
}
