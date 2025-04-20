export interface FeedbackFormData {
  name: string;
  email: string;
  comment: string;
  rating: number;
  mealId: string;
}

export interface FeedbackItem extends FeedbackFormData {
  id: string;
  recipeName: string;
  timestamp: string;
}

export interface FeedbackResponse {
  feedback: FeedbackItem[];
}
