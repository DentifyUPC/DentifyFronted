import {User} from "@/modules/iam/domain/entities/user.js";

export const UserMapper = {
    toDomain(raw) {
        if (!raw) return null;
        console.log("📥 Perfil recibido del backend:", raw);

        return new User({
            id: raw.id ?? raw.userId ?? null,
            username: raw.username ?? raw.email ?? "",
            fullName:
                raw.fullName ??
                (raw.personName
                    ? `${raw.personName.firstName ?? ""} ${raw.personName.lastName ?? ""}`.trim()
                    : ""),
            roleId: raw.role?.id ?? raw.roleId ?? null,
            roleName: raw.role?.name ?? raw.role ?? "", // 🔥 Importante
            clinicId: raw.clinic?.id ?? raw.clinicId ?? null,
            accessToken: raw.accessToken ?? raw.token ?? null,
            refreshToken: raw.refreshToken ?? null,
            email: raw.email ?? raw.email?.value ?? "",
        });
    },
};
