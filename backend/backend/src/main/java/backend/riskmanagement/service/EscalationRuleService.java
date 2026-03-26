package backend.riskmanagement.service;

import backend.riskmanagement.entity.EscalationRule;
import backend.riskmanagement.repository.EscalationRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EscalationRuleService {

    private final EscalationRuleRepository escalationRuleRepository;

    public EscalationRule createRule(EscalationRule rule) {
        return escalationRuleRepository.save(rule);
    }

    public List<EscalationRule> getAllRules() {
        return escalationRuleRepository.findAll();
    }
}