import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import styles from "../styles/ProfilePage.module.css";

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
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
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
    if (!file) return;
    setAvatarUploading(true);
    const filePath = `avatars/${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      showToast("Failed to upload image.", "error");
      setAvatarUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    await supabase
      .from("users_meta")
      .update({ avatar_url: publicUrl })
      .eq("uid", user.id);
    setUserMeta((prev) => ({ ...prev, avatar_url: publicUrl }));
    showToast("Profile picture updated.", "success");
    setAvatarUploading(false);
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
