
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";

interface EvaluationFormProps {
  onClose: () => void;
}

const QUESTIONS = [
  "¿Cómo calificarías las habilidades de comunicación de esta persona?",
  "¿Cómo evalúas su capacidad de trabajo en equipo?",
  "¿Qué tan efectivo es en la resolución de problemas?",
  "¿Cómo calificarías su liderazgo y toma de decisiones?",
  "¿Qué tan bien maneja las situaciones de presión?"
];

export const EvaluationForm = ({ onClose }: EvaluationFormProps) => {
  const [responses, setResponses] = useState<Record<string, { score: string; response: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if(onClose) onClose()
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Evaluar a {"userName"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((question) => (
            <div key={question} className="space-y-4">
              <Label className="text-lg font-medium">{question}</Label>
              
              <RadioGroup
                value={responses[question]?.score}
                onValueChange={(value) => 
                  setResponses(prev => ({
                    ...prev,
                    [question]: { ...prev[question], score: value }
                  }))
                }
                className="flex space-x-4 mb-4"
              >
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex items-center space-x-2">
                    <RadioGroupItem value={score.toString()} id={`${question}-${score}`} />
                    <Label htmlFor={`${question}-${score}`}>{score}</Label>
                  </div>
                ))}
              </RadioGroup>

              <Textarea
                value={responses[question]?.response || ""}
                onChange={(e) => 
                  setResponses(prev => ({
                    ...prev,
                    [question]: { ...prev[question], response: e.target.value }
                  }))
                }
                placeholder="Escribe tus comentarios aquí..."
                className="w-full"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Evaluación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
