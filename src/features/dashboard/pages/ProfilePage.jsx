import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import styles from "../styles/ProfilePage.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadImage, deleteImage } from "../../../utils/handleImage";

const ProfilePage = () => {
  const { user, userMeta, setUserMeta } = useAuth();

  // --- Edit Name ---
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(userMeta?.name ?? "");
  const [nameSaving, setNameSaving] = useState(false);

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    setNameSaving(true);
    const { error } = await supabase
      .from("users_meta")
      .update({ name: nameValue.trim() })
      .eq("uid", user.id);
    if (error) {
      showToast("Failed to update name.", "error");
    } else {
      setUserMeta((prev) => ({ ...prev, name: nameValue.trim() }));
      showToast("Name updated.", "success");
      setEditingName(false);
    }
    setNameSaving(false);
  };

  // --- Change Password ---
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleSavePassword = async () => {
    // console.log("email: ", user.email);

    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      showToast(
        "Password must contain at least one uppercase letter.",
        "error",
      );
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      showToast(
        "Password must contain at least one lowercase letter.",
        "error",
      );
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      showToast("Password must contain at least one number.", "error");
      return;
    }
    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      showToast("Failed to update password.", "error");
    } else {
      showToast("Password updated.", "success");
      setChangingPassword(false);
      setNewPassword("");
    }
    setPasswordSaving(false);
  };

  // --- Profile Picture ---
  const fileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarUrl = userMeta?.avatar_url ?? null;

  const handleAvatarChange = async (e) => {
    
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image file.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("File too large. Maximum allowed size is 2 MB.", "error");
      return;
    }
    setAvatarUploading(true);
    try {
      // Delete old image from storage if one exists
      if (avatarUrl) {
        await deleteImage(avatarUrl, "profile_pics");
      }

      // Upload new image — name the file after the email prefix
      const ext = file.name.split(".").pop();
      const emailPrefix = user.email.split("@")[0];
      const renamedFile = new File([file], `${emailPrefix}.${ext}`, {
        type: file.type,
      });
      const publicUrl = await uploadImage(renamedFile, "profile_pics", "pics");

      // Update DB
      const { error: dbError } = await supabase
        .from("users_meta")
        .update({ avatar_url: publicUrl, avatar_image_size: file.size })
        .eq("email", user.email);
      if (dbError) throw new Error(dbError.message);

      setUserMeta((prev) => ({
        ...prev,
        avatar_url: publicUrl,
        avatar_image_size: file.size,
      }));
      showToast("Profile picture updated.", "success");
    } catch {
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  const initials = (userMeta?.name ?? user?.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.page}>
      {/* Card */}
      <div className={styles.card}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            <button
              className={styles.avatarEditBtn}
              onClick={() => fileInputRef.current.click()}
              disabled={avatarUploading}
              title="Change photo"
            >
              {avatarUploading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-camera"></i>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className={styles.avatarMeta}>
            <span className={styles.roleBadge}>
              {userMeta?.role ?? "Member"}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          {/* Name Row */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              <i className="fa-solid fa-user"></i> Full Name
            </span>
            {editingName ? (
              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  autoFocus
                />
                <button
                  className={styles.saveBtn}
                  onClick={handleSaveName}
                  disabled={nameSaving}
                >
                  {nameSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setEditingName(false);
                    setNameValue(userMeta?.name ?? "");
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.fieldValue}>
                <span>{userMeta?.name ?? "—"}</span>
                <button
                  className={styles.editIconBtn}
                  onClick={() => setEditingName(true)}
                  title="Edit name"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Email Row */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              <i className="fa-solid fa-envelope"></i> Email
            </span>
            <div className={styles.fieldValue}>
              <span>{user?.email ?? "—"}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Role Row */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              <i className="fa-solid fa-shield-halved"></i> Role
            </span>
            <div className={styles.fieldValue}>
              <span>{userMeta?.role ?? "—"}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Password Row */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              <i className="fa-solid fa-lock"></i> Password
            </span>
            {changingPassword ? (
              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
                <button
                  className={styles.saveBtn}
                  onClick={handleSavePassword}
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setChangingPassword(false);
                    setNewPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.fieldValue}>
                <span>••••••••</span>
                <button
                  className={styles.editIconBtn}
                  onClick={() => setChangingPassword(true)}
                  title="Change password"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
