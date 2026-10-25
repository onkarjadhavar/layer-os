export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'owner' | 'manager' | 'supervisor' | 'accountant' | 'viewer';
export type FlockPhase = 'brooding' | 'growing' | 'pre_lay' | 'laying' | 'post_peak' | 'cull_ready';
export type CustomerType = 'trader' | 'wholesaler' | 'retailer' | 'hotel_bakery' | 'direct_consumer';
export type SaleItemType = 'eggs' | 'empty_bags' | 'spent_birds' | 'manure' | 'other';

export interface Database {
  public: {
    Tables: {
      farms: {
        Row: {
          id: string
          name: string
          owner_name: string
          phone: string
          email: string | null
          address: string | null
          district: string
          state: string
          pincode: string | null
          gstin: string | null
          total_capacity: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          owner_name: string
          phone: string
          email?: string | null
          address?: string | null
          district?: string
          state?: string
          pincode?: string | null
          gstin?: string | null
          total_capacity?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string
          phone?: string
          email?: string | null
          address?: string | null
          district?: string
          state?: string
          pincode?: string | null
          gstin?: string | null
          total_capacity?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          farm_id: string
          phone: string
          full_name: string
          role: UserRole
          preferred_language: string
          is_active: boolean
          auth_user_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          farm_id: string
          phone: string
          full_name: string
          role?: UserRole
          preferred_language?: string
          is_active?: boolean
          auth_user_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          farm_id?: string
          phone?: string
          full_name?: string
          role?: UserRole
          preferred_language?: string
          is_active?: boolean
          auth_user_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      unit_settings: {
        Row: {
          id: string
          farm_id: string
          tray_size_eggs: number
          gatta_size_trays: number
          carton_size_trays: number
          feed_bag_weight_kg: number
          default_egg_rate_unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          tray_size_eggs?: number
          gatta_size_trays?: number
          carton_size_trays?: number
          feed_bag_weight_kg?: number
          default_egg_rate_unit?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          tray_size_eggs?: number
          gatta_size_trays?: number
          carton_size_trays?: number
          feed_bag_weight_kg?: number
          default_egg_rate_unit?: string
          created_at?: string
          updated_at?: string
        }
      }
      sheds: {
        Row: {
          id: string
          farm_id: string
          shed_number: string
          name: string | null
          capacity: number
          shed_type: string
          has_climate_sensors: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          shed_number: string
          name?: string | null
          capacity: number
          shed_type?: string
          has_climate_sensors?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          shed_number?: string
          name?: string | null
          capacity?: number
          shed_type?: string
          has_climate_sensors?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      flocks: {
        Row: {
          id: string
          farm_id: string
          shed_id: string | null
          batch_code: string
          breed: string
          hatchery_source: string | null
          placement_date: string
          initial_chick_count: number
          chick_cost_per_bird: number
          current_bird_count: number
          current_phase: FlockPhase
          cumulative_rearing_cost: number
          amortization_months: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          farm_id: string
          shed_id?: string | null
          batch_code: string
          breed?: string
          hatchery_source?: string | null
          placement_date: string
          initial_chick_count: number
          chick_cost_per_bird?: number
          current_bird_count: number
          current_phase?: FlockPhase
          cumulative_rearing_cost?: number
          amortization_months?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          farm_id?: string
          shed_id?: string | null
          batch_code?: string
          breed?: string
          hatchery_source?: string | null
          placement_date?: string
          initial_chick_count?: number
          chick_cost_per_bird?: number
          current_bird_count?: number
          current_phase?: FlockPhase
          cumulative_rearing_cost?: number
          amortization_months?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      daily_records: {
        Row: {
          id: string
          farm_id: string
          flock_id: string
          record_date: string
          opening_birds: number
          mortality: number
          culls: number
          closing_birds: number
          total_eggs_collected: number
          broken_cracked_eggs: number
          soft_shell_eggs: number
          reject_eggs: number
          good_eggs: number
          morning_collection: number
          evening_collection: number
          hd_pct: number
          feed_issued_kg: number
          feed_per_bird_g: number
          water_consumption_litres: number | null
          avg_egg_weight_g: number | null
          is_closed: boolean
          notes: string | null
          voice_note_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          flock_id: string
          record_date: string
          opening_birds: number
          mortality?: number
          culls?: number
          closing_birds: number
          total_eggs_collected?: number
          broken_cracked_eggs?: number
          soft_shell_eggs?: number
          reject_eggs?: number
          good_eggs?: number
          morning_collection?: number
          evening_collection?: number
          hd_pct: number
          feed_issued_kg?: number
          feed_per_bird_g?: number
          water_consumption_litres?: number | null
          avg_egg_weight_g?: number | null
          is_closed?: boolean
          notes?: string | null
          voice_note_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          flock_id?: string
          record_date?: string
          opening_birds?: number
          mortality?: number
          culls?: number
          closing_birds?: number
          total_eggs_collected?: number
          broken_cracked_eggs?: number
          soft_shell_eggs?: number
          reject_eggs?: number
          good_eggs?: number
          morning_collection?: number
          evening_collection?: number
          hd_pct?: number
          feed_issued_kg?: number
          feed_per_bird_g?: number
          water_consumption_litres?: number | null
          avg_egg_weight_g?: number | null
          is_closed?: boolean
          notes?: string | null
          voice_note_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          farm_id: string
          name: string
          phone: string
          area: string | null
          customer_type: CustomerType
          credit_limit: number
          credit_days: number
          current_outstanding: number
          default_price_unit: string
          preferred_discount_per_100: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          farm_id: string
          name: string
          phone: string
          area?: string | null
          customer_type?: CustomerType
          credit_limit?: number
          credit_days?: number
          current_outstanding?: number
          default_price_unit?: string
          preferred_discount_per_100?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          farm_id?: string
          name?: string
          phone?: string
          area?: string | null
          customer_type?: CustomerType
          credit_limit?: number
          credit_days?: number
          current_outstanding?: number
          default_price_unit?: string
          preferred_discount_per_100?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          farm_id: string
          customer_id: string | null
          invoice_number: string
          sale_date: string
          sale_type: SaleItemType
          quantity_units: number
          unit_name: string
          total_eggs_equivalent: number
          rate_per_unit: number
          gross_amount: number
          discount: number
          net_amount: number
          paid_amount: number
          payment_status: string
          vehicle_number: string | null
          delivery_person: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          customer_id?: string | null
          invoice_number: string
          sale_date: string
          sale_type?: SaleItemType
          quantity_units: number
          unit_name: string
          total_eggs_equivalent?: number
          rate_per_unit: number
          gross_amount: number
          discount?: number
          net_amount: number
          paid_amount?: number
          payment_status?: string
          vehicle_number?: string | null
          delivery_person?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          customer_id?: string | null
          invoice_number?: string
          sale_date?: string
          sale_type?: SaleItemType
          quantity_units?: number
          unit_name?: string
          total_eggs_equivalent?: number
          rate_per_unit?: number
          gross_amount?: number
          discount?: number
          net_amount?: number
          paid_amount?: number
          payment_status?: string
          vehicle_number?: string | null
          delivery_person?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          farm_id: string
          customer_id: string
          sale_id: string | null
          payment_date: string
          amount: number
          payment_mode: string
          reference_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          customer_id: string
          sale_id?: string | null
          payment_date: string
          amount: number
          payment_mode: string
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          customer_id?: string
          sale_id?: string | null
          payment_date?: string
          amount?: number
          payment_mode?: string
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          farm_id: string
          flock_id: string | null
          category_id: string | null
          expense_date: string
          amount: number
          payment_mode: string
          vendor_name: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          flock_id?: string | null
          category_id?: string | null
          expense_date: string
          amount: number
          payment_mode?: string
          vendor_name?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          flock_id?: string | null
          category_id?: string | null
          expense_date?: string
          amount?: number
          payment_mode?: string
          vendor_name?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      market_rates: {
        Row: {
          id: string
          mandi_name: string
          rate_date: string
          rate_per_100: number
          rate_per_egg: number
          trend: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          mandi_name: string
          rate_date: string
          rate_per_100: number
          trend?: string
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          mandi_name?: string
          rate_date?: string
          rate_per_100?: number
          trend?: string
          source?: string
          created_at?: string
        }
      }
      vaccination_tasks: {
        Row: {
          id: string
          farm_id: string
          flock_id: string
          vaccine_name: string
          disease_targeted: string
          due_age_weeks: number
          due_date: string
          status: string
          completed_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          flock_id: string
          vaccine_name: string
          disease_targeted: string
          due_age_weeks: number
          due_date: string
          status?: string
          completed_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          flock_id?: string
          vaccine_name?: string
          disease_targeted?: string
          due_age_weeks?: number
          due_date?: string
          status?: string
          completed_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          farm_id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          farm_id: string
          plan_id: string
          status: string
          billing_cycle: string
          current_period_start: string
          current_period_end: string
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          plan_id?: string
          status?: string
          billing_cycle?: string
          current_period_start?: string
          current_period_end?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          plan_id?: string
          status?: string
          billing_cycle?: string
          current_period_start?: string
          current_period_end?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      billing_invoices: {
        Row: {
          id: string
          farm_id: string
          subscription_id: string | null
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          razorpay_signature: string | null
          amount_paise: number
          currency: string
          status: string
          invoice_number: string | null
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          subscription_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          amount_paise: number
          currency?: string
          status?: string
          invoice_number?: string | null
          receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          subscription_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          amount_paise?: number
          currency?: string
          status?: string
          invoice_number?: string | null
          receipt_url?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      create_farm_with_owner: {
        Args: {
          p_farm_name: string
          p_owner_name: string
          p_phone: string
          p_district?: string
          p_capacity?: number
          p_breed?: string
          p_initial_birds?: number
          p_age_weeks?: number
        }
        Returns: Json
      }
      is_farm_member: {
        Args: {
          target_farm_id: string
        }
        Returns: boolean
      }
      has_farm_role: {
        Args: {
          target_farm_id: string
          required_roles: UserRole[]
        }
        Returns: boolean
      }
    }
  }
}
