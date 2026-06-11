package com.lucas.demo.service;

import com.lucas.demo.dto.DespesaResponseDTO;
import com.lucas.demo.exception.EntityNotFoundException;
import com.lucas.demo.model.DespesaModel;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository repository;

    public DespesaResponseDTO salvar(DespesaModel despesa) {
        LoginModel usuarioLogado = obterUsuarioLogado();

        despesa.setNome(limparTexto(despesa.getNome()));
        despesa.setCategoria(limparTexto(despesa.getCategoria()));
        despesa.setDescricao(limparTexto(despesa.getDescricao()));
        despesa.setValor(normalizarValorMonetario(despesa.getValor()));
        despesa.setUsuario(usuarioLogado);

        return new DespesaResponseDTO(repository.save(despesa));
    }

    public List<DespesaResponseDTO> listarDespesasDoUsuarioLogado() {
        LoginModel usuarioLogado = obterUsuarioLogado();
        return repository.findByUsuarioId(usuarioLogado.getId())
                .stream()
                .map(DespesaResponseDTO::new)
                .toList();
    }

    public DespesaResponseDTO buscarPorIdDoUsuarioLogado(Long id) {
        LoginModel usuarioLogado = obterUsuarioLogado();
        DespesaModel despesa = repository.findById(id)
                .filter(item -> item.getUsuario() != null
                        && item.getUsuario().getId().equals(usuarioLogado.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Despesa nao encontrada."));

        return new DespesaResponseDTO(despesa);
    }

    public void deletarPorIdDoUsuarioLogado(Long id) {
        LoginModel usuarioLogado = obterUsuarioLogado();
        DespesaModel despesa = repository.findById(id)
                .filter(item -> item.getUsuario() != null
                        && item.getUsuario().getId().equals(usuarioLogado.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Despesa nao encontrada."));

        repository.delete(despesa);
    }

    private LoginModel obterUsuarioLogado() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return (LoginModel) auth.getPrincipal();
    }

    private String limparTexto(String valor) {
        return valor == null ? null : valor.trim();
    }

    private BigDecimal normalizarValorMonetario(BigDecimal valor) {
        if (valor == null) {
            return null;
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
