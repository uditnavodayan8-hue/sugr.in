export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            access_requests: {
                Row: {
                    created_at: string | null
                    id: string
                    message: string | null
                    requester_id: string
                    status: string | null
                    target_id: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    message?: string | null
                    requester_id: string
                    status?: string | null
                    target_id: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    message?: string | null
                    requester_id?: string
                    status?: string | null
                    target_id?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "access_requests_requester_id_fkey"
                        columns: ["requester_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "access_requests_target_id_fkey"
                        columns: ["target_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            ads: {
                Row: {
                    content: string
                    created_at: string | null
                    expires_at: string | null
                    id: string
                    location: string
                    media_url: string | null
                    tier: Database["public"]["Enums"]["ad_tier"] | null
                    type: string
                    user_id: string | null
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    expires_at?: string | null
                    id?: string
                    location: string
                    media_url?: string | null
                    tier?: Database["public"]["Enums"]["ad_tier"] | null
                    type: string
                    user_id?: string | null
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    expires_at?: string | null
                    id?: string
                    location?: string
                    media_url?: string | null
                    tier?: Database["public"]["Enums"]["ad_tier"] | null
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "ads_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            broadcasts: {
                Row: {
                    content: string
                    created_at: string
                    id: string
                    likes_count: number | null
                    user_id: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    id?: string
                    likes_count?: number | null
                    user_id: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    id?: string
                    likes_count?: number | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "broadcasts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            matches: {
                Row: {
                    created_at: string
                    id: string
                    is_active: boolean | null
                    last_activity: string | null
                    score: number | null
                    status: string | null
                    user1_id: string
                    user2_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    last_activity?: string | null
                    score?: number | null
                    status?: string | null
                    user1_id: string
                    user2_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    last_activity?: string | null
                    score?: number | null
                    status?: string | null
                    user1_id?: string
                    user2_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "matches_user1_id_fkey"
                        columns: ["user1_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "matches_user2_id_fkey"
                        columns: ["user2_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    content: string
                    created_at: string
                    id: string
                    is_read: boolean | null
                    match_id: string
                    receiver_id: string
                    sender_id: string
                    type: string | null
                }
                Insert: {
                    content: string
                    created_at?: string
                    id?: string
                    is_read?: boolean | null
                    match_id: string
                    receiver_id: string
                    sender_id: string
                    type?: string | null
                }
                Update: {
                    content?: string
                    created_at?: string
                    id?: string
                    is_read?: boolean | null
                    match_id?: string
                    receiver_id?: string
                    sender_id?: string
                    type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_receiver_id_fkey"
                        columns: ["receiver_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            private_vault: {
                Row: {
                    created_at: string | null
                    granted_to: string[] | null
                    id: string
                    is_revealed: boolean | null
                    media_url: string
                    owner_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    granted_to?: string[] | null
                    id?: string
                    is_revealed?: boolean | null
                    media_url: string
                    owner_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    granted_to?: string[] | null
                    id?: string
                    is_revealed?: boolean | null
                    media_url?: string
                    owner_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "private_vault_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    age: number | null
                    allowance_range: string | null
                    avatar_url: string | null
                    bio: string | null
                    city: string | null
                    created_at: string
                    gender: string | null
                    id: string
                    images: string[] | null
                    lifestyle_tags: string[] | null
                    lifestyle_tier: string | null
                    location_lat: number | null
                    location_lon: number | null
                    looking_for: string[] | null
                    name: string | null
                    occupation: string | null
                    preferences: Json | null
                    role: string | null
                    sugr_index: number | null
                    trust_score: number | null
                    verification_level: Json | null
                    video_url: string | null
                }
                Insert: {
                    age?: number | null
                    allowance_range?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string
                    gender?: string | null
                    id: string
                    images?: string[] | null
                    lifestyle_tags?: string[] | null
                    lifestyle_tier?: string | null
                    location_lat?: number | null
                    location_lon?: number | null
                    looking_for?: string[] | null
                    name?: string | null
                    occupation?: string | null
                    preferences?: Json | null
                    role?: string | null
                    sugr_index?: number | null
                    trust_score?: number | null
                    verification_level?: Json | null
                    video_url?: string | null
                }
                Update: {
                    age?: number | null
                    allowance_range?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string
                    gender?: string | null
                    id?: string
                    images?: string[] | null
                    lifestyle_tags?: string[] | null
                    lifestyle_tier?: string | null
                    location_lat?: number | null
                    location_lon?: number | null
                    looking_for?: string[] | null
                    name?: string | null
                    occupation?: string | null
                    preferences?: Json | null
                    role?: string | null
                    sugr_index?: number | null
                    trust_score?: number | null
                    verification_level?: Json | null
                    video_url?: string | null
                }
                Relationships: []
            }
            swipes: {
                Row: {
                    created_at: string | null
                    direction: string
                    id: string
                    swiper_id: string
                    target_id: string
                }
                Insert: {
                    created_at?: string | null
                    direction: string
                    id?: string
                    swiper_id: string
                    target_id: string
                }
                Update: {
                    created_at?: string | null
                    direction?: string
                    id?: string
                    swiper_id?: string
                    target_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "swipes_swiper_id_fkey"
                        columns: ["swiper_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "swipes_target_id_fkey"
                        columns: ["target_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trips: {
                Row: {
                    allowance_offer: string | null
                    created_at: string
                    description: string | null
                    destination: string
                    end_date: string
                    id: string
                    start_date: string
                    status: string | null
                    user_id: string
                }
                Insert: {
                    allowance_offer?: string | null
                    created_at?: string
                    description?: string | null
                    destination: string
                    end_date: string
                    id?: string
                    start_date: string
                    status?: string | null
                    user_id: string
                }
                Update: {
                    allowance_offer?: string | null
                    created_at?: string
                    description?: string | null
                    destination?: string
                    end_date?: string
                    id?: string
                    start_date?: string
                    status?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "trips_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_presence: {
                Row: {
                    last_seen: string | null
                    status: string | null
                    typing_in_match: string | null
                    user_id: string
                }
                Insert: {
                    last_seen?: string | null
                    status?: string | null
                    typing_in_match?: string | null
                    user_id: string
                }
                Update: {
                    last_seen?: string | null
                    status?: string | null
                    typing_in_match?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_presence_typing_in_match_fkey"
                        columns: ["typing_in_match"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_presence_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            check_match: {
                Args: {
                    user_a: string
                    user_b: string
                }
                Returns: boolean
            }
            distance: {
                Args: {
                    lat1: number
                    lon1: number
                    lat2: number
                    lon2: number
                }
                Returns: number
            }
            get_nearby_users: {
                Args: {
                    user_lat: number
                    user_lon: number
                    radius_km: number
                }
                Returns: {
                    id: string
                    name: string
                    avatar_url: string
                    distance_km: number
                }[]
            }
            update_user_location: {
                Args: {
                    lat: number
                    lon: number
                }
                Returns: undefined
            }
        }
        Enums: {
            ad_tier: "executive" | "elite" | "premium"
            user_role: "provider" | "protege"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
