import { useState, useEffect } from 'react';
import profileService from '../services/profileService';

interface SkillNode {
  _id: string;
  name: string;
  status: 'to_learn' | 'in_progress' | 'verified';
  category: string;
  goalTag: string;
  positionX: number;
  positionY: number;
}

const useSkillMap = () => {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await profileService.getMySkills();
      setSkills(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (data: Record<string, unknown>) => {
    const newSkill = await profileService.createSkill(data);
    setSkills((prev) => [...prev, newSkill]);
    return newSkill;
  };

  const updateSkill = async (id: string, data: Record<string, unknown>) => {
    const updated = await profileService.updateSkill(id, data);
    setSkills((prev) => prev.map((s) => (s._id === id ? updated : s)));
    return updated;
  };

  const removeSkill = async (id: string) => {
    await profileService.deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s._id !== id));
  };

  return { skills, loading, error, addSkill, updateSkill, removeSkill, refetch: fetchSkills };
};

export default useSkillMap;
