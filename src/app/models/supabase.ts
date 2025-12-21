export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      t1_15221: {
        Row: {
          cliente_n: string | null
          cliente_t: string | null
          cont11: number | null
          cont2: number | null
          cont3: number | null
          cont4: number | null
          cont6: number | null
          cont8: number | null
          contf: number | null
          entregada: string | null
          estado: string | null
          fcr: string | null
          fecha_fin: string | null
          fecha_ini: string | null
          fecha_sinc: string | null
          fecha_sinc_fin: string | null
          gpslat_fin: string | null
          gpslat_ini: string | null
          gpslon_fin: string | null
          gpslon_ini: string | null
          hora_fin: string | null
          hora_ini: string | null
          hora_sinc: string | null
          hora_sinc_fin: string | null
          id1: string | null
          id2: string | null
          idencuesta: string
          maestro1: string | null
          maestro10: string | null
          maestro11: string | null
          maestro12: string | null
          maestro2: string | null
          maestro3: string | null
          maestro4: string | null
          maestro5: string | null
          maestro6: string | null
          maestro7: string | null
          maestro8: string | null
          maestro9: string | null
          maquina: string | null
          mconfir1: string | null
          mconfir10: string | null
          mconfir11: string | null
          mconfir12: string | null
          mconfir2: string | null
          mconfir3: string | null
          mconfir4: string | null
          mconfir5: string | null
          mconfir6: string | null
          mconfir7: string | null
          mconfir8: string | null
          mconfir9: string | null
          observaciones: string | null
          sincronizada: string | null
          sup_pre1: string | null
          sup_pre2: string | null
          sup_pre3: string | null
          sup_tel1: string | null
          sup_tel2: string | null
          sup_tel3: string | null
          usuario: string | null
          versionapp: string | null
          versiondb: string | null
        }
        Insert: {
          cliente_n?: string | null
          cliente_t?: string | null
          cont11?: number | null
          cont2?: number | null
          cont3?: number | null
          cont4?: number | null
          cont6?: number | null
          cont8?: number | null
          contf?: number | null
          entregada?: string | null
          estado?: string | null
          fcr?: string | null
          fecha_fin?: string | null
          fecha_ini?: string | null
          fecha_sinc?: string | null
          fecha_sinc_fin?: string | null
          gpslat_fin?: string | null
          gpslat_ini?: string | null
          gpslon_fin?: string | null
          gpslon_ini?: string | null
          hora_fin?: string | null
          hora_ini?: string | null
          hora_sinc?: string | null
          hora_sinc_fin?: string | null
          id1?: string | null
          id2?: string | null
          idencuesta: string
          maestro1?: string | null
          maestro10?: string | null
          maestro11?: string | null
          maestro12?: string | null
          maestro2?: string | null
          maestro3?: string | null
          maestro4?: string | null
          maestro5?: string | null
          maestro6?: string | null
          maestro7?: string | null
          maestro8?: string | null
          maestro9?: string | null
          maquina?: string | null
          mconfir1?: string | null
          mconfir10?: string | null
          mconfir11?: string | null
          mconfir12?: string | null
          mconfir2?: string | null
          mconfir3?: string | null
          mconfir4?: string | null
          mconfir5?: string | null
          mconfir6?: string | null
          mconfir7?: string | null
          mconfir8?: string | null
          mconfir9?: string | null
          observaciones?: string | null
          sincronizada?: string | null
          sup_pre1?: string | null
          sup_pre2?: string | null
          sup_pre3?: string | null
          sup_tel1?: string | null
          sup_tel2?: string | null
          sup_tel3?: string | null
          usuario?: string | null
          versionapp?: string | null
          versiondb?: string | null
        }
        Update: {
          cliente_n?: string | null
          cliente_t?: string | null
          cont11?: number | null
          cont2?: number | null
          cont3?: number | null
          cont4?: number | null
          cont6?: number | null
          cont8?: number | null
          contf?: number | null
          entregada?: string | null
          estado?: string | null
          fcr?: string | null
          fecha_fin?: string | null
          fecha_ini?: string | null
          fecha_sinc?: string | null
          fecha_sinc_fin?: string | null
          gpslat_fin?: string | null
          gpslat_ini?: string | null
          gpslon_fin?: string | null
          gpslon_ini?: string | null
          hora_fin?: string | null
          hora_ini?: string | null
          hora_sinc?: string | null
          hora_sinc_fin?: string | null
          id1?: string | null
          id2?: string | null
          idencuesta?: string
          maestro1?: string | null
          maestro10?: string | null
          maestro11?: string | null
          maestro12?: string | null
          maestro2?: string | null
          maestro3?: string | null
          maestro4?: string | null
          maestro5?: string | null
          maestro6?: string | null
          maestro7?: string | null
          maestro8?: string | null
          maestro9?: string | null
          maquina?: string | null
          mconfir1?: string | null
          mconfir10?: string | null
          mconfir11?: string | null
          mconfir12?: string | null
          mconfir2?: string | null
          mconfir3?: string | null
          mconfir4?: string | null
          mconfir5?: string | null
          mconfir6?: string | null
          mconfir7?: string | null
          mconfir8?: string | null
          mconfir9?: string | null
          observaciones?: string | null
          sincronizada?: string | null
          sup_pre1?: string | null
          sup_pre2?: string | null
          sup_pre3?: string | null
          sup_tel1?: string | null
          sup_tel2?: string | null
          sup_tel3?: string | null
          usuario?: string | null
          versionapp?: string | null
          versiondb?: string | null
        }
        Relationships: []
      }
      t11_15221: {
        Row: {
          codb: string | null
          coin: number | null
          exc: number | null
          fcr: string | null
          foto: string | null
          id1: number | null
          id2: number | null
          ida: number | null
          idencuesta: string | null
          nact: string | null
          rta: number | null
          scanner: string | null
        }
        Insert: {
          codb?: string | null
          coin?: number | null
          exc?: number | null
          fcr?: string | null
          foto?: string | null
          id1?: number | null
          id2?: number | null
          ida?: number | null
          idencuesta?: string | null
          nact?: string | null
          rta?: number | null
          scanner?: string | null
        }
        Update: {
          codb?: string | null
          coin?: number | null
          exc?: number | null
          fcr?: string | null
          foto?: string | null
          id1?: number | null
          id2?: number | null
          ida?: number | null
          idencuesta?: string | null
          nact?: string | null
          rta?: number | null
          scanner?: string | null
        }
        Relationships: []
      }
      t2_15221: {
        Row: {
          esp: number | null
          eval: number | null
          fcr: string | null
          id1: number | null
          id2: number | null
          idencuesta: string | null
          rta: number | null
        }
        Insert: {
          esp?: number | null
          eval?: number | null
          fcr?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          rta?: number | null
        }
        Update: {
          esp?: number | null
          eval?: number | null
          fcr?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          rta?: number | null
        }
        Relationships: []
      }
      t3_15221: {
        Row: {
          cat: number | null
          esp: number | null
          eval: number | null
          fcr: string | null
          id1: number | null
          id2: number | null
          idencuesta: string | null
          rta: number | null
        }
        Insert: {
          cat?: number | null
          esp?: number | null
          eval?: number | null
          fcr?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          rta?: number | null
        }
        Update: {
          cat?: number | null
          esp?: number | null
          eval?: number | null
          fcr?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          rta?: number | null
        }
        Relationships: []
      }
      t6_15221: {
        Row: {
          cant: number | null
          cat: number | null
          esp: number | null
          exhibiciones: string | null
          fcr: string | null
          id: number | null
          id1: number | null
          id2: number | null
          idencuesta: string | null
          increase_share: string | null
          ncat: string | null
          nesp: string | null
          rta: number | null
          tipo: number | null
        }
        Insert: {
          cant?: number | null
          cat?: number | null
          esp?: number | null
          exhibiciones?: string | null
          fcr?: string | null
          id?: number | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          increase_share?: string | null
          ncat?: string | null
          nesp?: string | null
          rta?: number | null
          tipo?: number | null
        }
        Update: {
          cant?: number | null
          cat?: number | null
          esp?: number | null
          exhibiciones?: string | null
          fcr?: string | null
          id?: number | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          increase_share?: string | null
          ncat?: string | null
          nesp?: string | null
          rta?: number | null
          tipo?: number | null
        }
        Relationships: []
      }
      t8_15221: {
        Row: {
          aplica: number | null
          fcr: string | null
          grupo: number | null
          id1: number | null
          id2: number | null
          idencuesta: string | null
          idpreg: string | null
          optn: number | null
          optt: string | null
          orden: number | null
          preg: string | null
          rta: string | null
          tipo: number | null
        }
        Insert: {
          aplica?: number | null
          fcr?: string | null
          grupo?: number | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          idpreg?: string | null
          optn?: number | null
          optt?: string | null
          orden?: number | null
          preg?: string | null
          rta?: string | null
          tipo?: number | null
        }
        Update: {
          aplica?: number | null
          fcr?: string | null
          grupo?: number | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          idpreg?: string | null
          optn?: number | null
          optt?: string | null
          orden?: number | null
          preg?: string | null
          rta?: string | null
          tipo?: number | null
        }
        Relationships: []
      }
      tf_15221: {
        Row: {
          cat: string | null
          esp: string | null
          id1: number | null
          id2: number | null
          idencuesta: string | null
          idp: string | null
          obs: string | null
          path: string | null
          preg: string | null
          ref: string | null
          sincfs: number | null
        }
        Insert: {
          cat?: string | null
          esp?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          idp?: string | null
          obs?: string | null
          path?: string | null
          preg?: string | null
          ref?: string | null
          sincfs?: number | null
        }
        Update: {
          cat?: string | null
          esp?: string | null
          id1?: number | null
          id2?: number | null
          idencuesta?: string | null
          idp?: string | null
          obs?: string | null
          path?: string | null
          preg?: string | null
          ref?: string | null
          sincfs?: number | null
        }
        Relationships: []
      }
      tr_15221: {
        Row: {
          cliente_n: string | null
          cliente_t: string | null
          contf: number | null
          fcr: string | null
          fecha_fin: string | null
          fecha_ini: string | null
          fecha_sinc: string | null
          gpslat_fin: string | null
          gpslat_ini: string | null
          gpslon_fin: string | null
          gpslon_ini: string | null
          hora_fin: string | null
          hora_ini: string | null
          hora_sinc: string | null
          id1: number | null
          idencuesta: string | null
          idrazon: number | null
          maquina: string | null
          nrazon: string | null
          observaciones: string | null
          peratendio: string | null
          sincronizada: string | null
          usuario: string | null
          versionapp: string | null
          versiondb: string | null
        }
        Insert: {
          cliente_n?: string | null
          cliente_t?: string | null
          contf?: number | null
          fcr?: string | null
          fecha_fin?: string | null
          fecha_ini?: string | null
          fecha_sinc?: string | null
          gpslat_fin?: string | null
          gpslat_ini?: string | null
          gpslon_fin?: string | null
          gpslon_ini?: string | null
          hora_fin?: string | null
          hora_ini?: string | null
          hora_sinc?: string | null
          id1?: number | null
          idencuesta?: string | null
          idrazon?: number | null
          maquina?: string | null
          nrazon?: string | null
          observaciones?: string | null
          peratendio?: string | null
          sincronizada?: string | null
          usuario?: string | null
          versionapp?: string | null
          versiondb?: string | null
        }
        Update: {
          cliente_n?: string | null
          cliente_t?: string | null
          contf?: number | null
          fcr?: string | null
          fecha_fin?: string | null
          fecha_ini?: string | null
          fecha_sinc?: string | null
          gpslat_fin?: string | null
          gpslat_ini?: string | null
          gpslon_fin?: string | null
          gpslon_ini?: string | null
          hora_fin?: string | null
          hora_ini?: string | null
          hora_sinc?: string | null
          id1?: number | null
          idencuesta?: string | null
          idrazon?: number | null
          maquina?: string | null
          nrazon?: string | null
          observaciones?: string | null
          peratendio?: string | null
          sincronizada?: string | null
          usuario?: string | null
          versionapp?: string | null
          versiondb?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const