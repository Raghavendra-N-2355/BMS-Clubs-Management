-- Create function to generate unique ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := 'BMSCE-' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('ticket_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for ticket numbers
CREATE SEQUENCE ticket_seq START 1;

-- Apply trigger to registrations
CREATE TRIGGER generate_registration_ticket BEFORE INSERT ON registrations
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();