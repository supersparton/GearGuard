// src/services/workcenters.service.js - Work Centers Service
const supabase = require('../config/supabase');

class WorkCentersService {
    async getAll() {
        const { data, error } = await supabase.adminClient
            .from('work_centers')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    }

    async getById(id) {
        const { data, error } = await supabase.adminClient
            .from('work_centers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(workCenterData) {
        const { data, error } = await supabase.adminClient
            .from('work_centers')
            .insert([workCenterData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id, workCenterData) {
        const { data, error } = await supabase.adminClient
            .from('work_centers')
            .update(workCenterData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async delete(id) {
        const { error } = await supabase.adminClient
            .from('work_centers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    }
}

module.exports = new WorkCentersService();
